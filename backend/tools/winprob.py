def over_to_balls(over: float) -> int:
    """Converts an over float (e.g. 14.2) into total balls bowled (e.g. 86)."""
    overs_int = int(over)
    balls = int(round((over - overs_int) * 10))
    # Cap balls in an over at 6 for standard over inputs
    if balls > 6:
        balls = 6
    return (overs_int * 6) + balls

def calculate_win_probability(
    innings: int,
    over: float,
    score: int,
    wickets: int,
    pitch: str,
    dew: str,
    powerplay: bool,
    death_overs: bool,
    target: int = None
) -> dict:
    """
    Calculates the live win probability, run rates, pressure level, and suggested bowling type
    for the current IPL match state based on pitch, dew, and wickets.
    
    Args:
        innings: Current innings: 1 (setting score) or 2 (chasing)
        over: Current over in the match (e.g. 14.2)
        score: Current runs scored by the batting team
        wickets: Current wickets lost by the batting team (0 to 10)
        pitch: Pitch condition: 'flat', 'turning', or 'two-paced'
        dew: Dew factor: 'low', 'medium', or 'high'
        powerplay: Is the powerplay currently active?
        death_overs: Are we in the death overs (last 4 overs of the innings)?
        target: Target score to win, required if innings is 2
        
    Returns:
        A dictionary containing:
            - win_probability (float): Batting team win probability (0-100)
            - bowling_team_win_probability (float): Bowling team win probability (0-100)
            - current_run_rate (float): Runs scored per over
            - required_run_rate (float): Runs needed per over (only in innings 2)
            - pressure (str): 'LOW', 'MEDIUM', or 'HIGH'
            - suggested_bowling_type (str): 'pace' or 'spin'
    """
    balls_bowled = over_to_balls(over)
    if balls_bowled > 120:
        balls_bowled = 120
    balls_remaining = 120 - balls_bowled
    
    # Calculate Current Run Rate (CRR)
    current_run_rate = (score / balls_bowled) * 6 if balls_bowled > 0 else 0.0
    current_run_rate = round(current_run_rate, 2)
    
    required_run_rate = 0.0
    batting_win_prob = 50.0
    
    # Check if wickets are all out
    if wickets >= 10:
        batting_win_prob = 0.0
    elif innings == 1:
        # INNINGS 1: Batting team is setting the target
        # Project final score
        # Base projection: current run rate over 20 overs
        wickets_remaining = 10 - wickets
        
        # Par score depends on the pitch
        par_score = 160
        if pitch == "flat":
            par_score = 185
        elif pitch == "turning":
            par_score = 145
        elif pitch == "two-paced":
            par_score = 160
            
        if balls_bowled == 0:
            projected_score = par_score
        else:
            # If they keep going at current run rate, but adjusted for wickets lost
            wicket_penalty = (wickets / 10.0) * 1.5  # Lose run rate speed as they lose wickets
            projected_rr = max(current_run_rate * (1.0 - wicket_penalty), 5.0)
            # Standard regression to par score for remaining overs
            remaining_expected_rr = (projected_rr * 0.5) + (8.0 * 0.5) * (wickets_remaining / 10.0)
            projected_score = score + (balls_remaining / 6) * remaining_expected_rr
            
        # Compare projected score to pitch par score
        diff_from_par = projected_score - par_score
        batting_win_prob = 50.0 + (diff_from_par * 0.5)
        
        # Adjust for Dew (Dew makes chasing easier, so batting 1st has lower win prob if dew is high)
        if dew == "high":
            batting_win_prob -= 10.0
        elif dew == "medium":
            batting_win_prob -= 5.0
            
        # Adjust for wickets remaining (losing many wickets reduces win prob drastically)
        if wickets >= 6:
            batting_win_prob -= (wickets - 4) * 8.0
            
    else:
        # INNINGS 2: Batting team is chasing the target
        if target is None:
            target = 160  # default fallback
            
        runs_needed = target - score
        
        if runs_needed <= 0:
            batting_win_prob = 100.0
        elif balls_remaining <= 0 and runs_needed > 0:
            batting_win_prob = 0.0
        else:
            required_run_rate = (runs_needed / balls_remaining) * 6
            required_run_rate = round(required_run_rate, 2)
            
            wickets_remaining = 10 - wickets
            
            # Simple model: compare RRR vs CRR and account for wickets
            # Let's say RRR = 8 is par. If wickets remaining are high, chasing is easier.
            rrr_diff = required_run_rate - 8.0
            
            # Base probability starts at 50%
            prob = 50.0
            # Higher required run rate hurts chasing probability
            prob -= rrr_diff * 12.0
            # Wickets lost hurts chasing probability
            prob -= (wickets * 7.5)
            # Having wickets in hand helps
            prob += (wickets_remaining * 2.5)
            
            # Dew helps chasing (wet ball, hard to grip for bowling team)
            if dew == "high":
                prob += 12.0
            elif dew == "medium":
                prob += 6.0
                
            # Pitch factor
            if pitch == "turning":
                # Chasing is extremely hard on a turning track
                prob -= 10.0
            elif pitch == "two-paced":
                prob -= 5.0
            elif pitch == "flat":
                prob += 5.0
                
            batting_win_prob = prob
            
    # Clamp win probability
    batting_win_prob = max(1.0, min(99.0, batting_win_prob))
    if wickets >= 10:
        batting_win_prob = 0.0
    if innings == 2 and target is not None and score >= target:
        batting_win_prob = 100.0
        
    batting_win_prob = round(batting_win_prob, 1)
    bowling_win_prob = round(100.0 - batting_win_prob, 1)
    
    # Determine Pressure level
    if innings == 1:
        if wickets >= 6 or (over >= 15.0 and wickets >= 4) or (over >= 6.0 and current_run_rate < 6.5):
            pressure = "HIGH"
        elif wickets >= 4 or (over >= 10.0 and current_run_rate < 7.5):
            pressure = "MEDIUM"
        else:
            pressure = "LOW"
    else:
        # Innings 2 pressure
        if target is None:
            target = 160
        runs_needed = target - score
        if balls_remaining > 0:
            req_rr = (runs_needed / balls_remaining) * 6
        else:
            req_rr = 999.0
            
        if req_rr > 11.0 or wickets >= 6 or (balls_remaining < 30 and req_rr > 9.5 and wickets >= 4):
            pressure = "HIGH"
        elif req_rr > 8.5 or wickets >= 4 or (balls_remaining < 60 and req_rr > 8.0):
            pressure = "MEDIUM"
        else:
            pressure = "LOW"
            
    # Determine Suggested Bowling Type
    # Pitch conditions rule first
    if pitch == "turning":
        # Turning pitch calls for spin!
        if dew == "high":
            # But high dew makes spin impossible to grip
            suggested_bowling_type = "pace"
        else:
            suggested_bowling_type = "spin"
    elif pitch == "two-paced":
        # Two-paced pitch is good for cutters/spin, but in powerplay or death, pace is preferred
        if powerplay or death_overs:
            suggested_bowling_type = "pace"
        else:
            suggested_bowling_type = "spin"
    else:
        # Flat pitch: pace is standard, spinners get slaughtered unless it's middle overs
        if not powerplay and not death_overs and dew != "high":
            # Spinner might squeeze in middle overs if dry
            suggested_bowling_type = "spin"
        else:
            suggested_bowling_type = "pace"
            
    return {
        "win_probability": batting_win_prob,
        "bowling_team_win_probability": bowling_win_prob,
        "current_run_rate": current_run_rate,
        "required_run_rate": required_run_rate,
        "pressure": pressure,
        "suggested_bowling_type": suggested_bowling_type
    }

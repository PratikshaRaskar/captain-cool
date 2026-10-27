import os
import logging
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai

# Import local modules
from schemas import MatchState
from tools.winprob import calculate_win_probability
from agents.analyst import run_analyst
from agents.strategist import run_strategist_initial, run_strategist_final
from agents.devil import run_devil
from agents.commentator import run_commentator

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("captain-cool")

# Load environment variables from .env
load_dotenv()

app = FastAPI(
    title="Captain Cool — Multi-Agent IPL Match Strategist",
    description="An agentic AI system that suggests the NEXT tactical decision in a live IPL match using Google Gemini.",
    version="1.1.0"
)

# Enable CORS (allow all origins, headers, and methods)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google GenAI client
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        client = genai.Client(api_key=api_key)
    else:
        logger.warning("GEMINI_API_KEY not found in environment. Gemini calls will fail.")
        client = None
except Exception as e:
    logger.error(f"Failed to initialize Gemini Client: {e}")
    client = None

def generate_mock_strategy(match_state: dict, stats: dict, force_clean: bool = False) -> dict:
    """
    Generates a beautifully structured high-fidelity offline strategist debate
    in case of Gemini API key rate limits or quota exhaustion.
    """
    striker = match_state.get("striker", "Batsman")
    non_striker = match_state.get("non_striker", "Non-Striker")
    batting_team = match_state.get("batting_team", "Batting Team")
    bowling_team = match_state.get("bowling_team", "Bowling Team")
    pitch = match_state.get("pitch", "flat")
    dew = match_state.get("dew", "low")
    over = match_state.get("over", 15.0)
    wickets = match_state.get("wickets", 5)
    runs = match_state.get("score", 100)
    target = match_state.get("target", 150)
    
    bowlers = match_state.get("bowlers", [])
    suggested_bowler = bowlers[0]["name"] if bowlers else "your primary strike bowler"
    
    analyst_response = f"""[STATS ANALYST DECRUNCH]
Match State: {batting_team} is chasing {target} runs against {bowling_team}. They are currently at {runs}/{wickets} in {over} overs.
Pitch is {pitch} and dew is {dew}. Win probability calculator suggests a {stats.get('win_probability')}% batting team win probability.
Match pressure is rated as {stats.get('pressure')}. Best matched bowling type: {stats.get('suggested_bowling_type')}.
Primary threat: {striker} is looking dangerous at the crease, supported by {non_striker}."""

    strategist_initial = f"""[INITIAL CAPTAIN TACTICS]
Bowler Choice: Let's bring on {suggested_bowler} to bowl the next over.
Field Placement: Protect the boundaries, put a deep mid-wicket and a long-on. Let's bowl standard lines to restrict scoring.
Strategic Timeout: Hold for the next over.
Impact Player: Keep in reserve."""

    devil_response = f"""[DEVIL'S ADVOCATE COUNTER]
Objection! Bowling {suggested_bowler} right now is a defensive move. {striker} is a destructive batsman who will easily exploit standard deep boundary fields on a {pitch} track. We need wickets, not just containment!
Alternative Proposal: Bring on a spin trap with slip catchers to induce an edge, or go for raw pace targeting the stumps directly. Take the timeout immediately to break {striker}'s momentum!"""

    strategist_final = f"""[FINAL TACTICAL DECISION]
Re-evaluation: The Devil is correct. Containment will lose us the game at this stage.
Final Move: We will bowl {suggested_bowler} but with an aggressive wicket-taking field—introduce a short fine leg and extra cover. Let's attack the stumps!
Strategic Timeout: Take the timeout now to reset field positions and build pressure.
Impact Player: Introduce a specialist bowler immediately."""

    final_output = f"""🧢 CAPTAIN'S CALL
- Next Over Bowler: {suggested_bowler}
- Field Setup: Aggressive wicket-taking trap, adding key catching positions (short fine leg, extra cover).
- Plan: Discard containment. Attack the stumps directly to target {striker}'s front-foot weakness.
- Strategic Timeout: Take now!
- Impact Player: Deploy specialist wicket-taker immediately!

📌 WHY THIS MOVE
With pressure levels rated as {stats.get('pressure')}, standard containment is too risky. The captain has shifted to a 'wicket-first' approach to disrupt {striker} and {non_striker} before the game slips away.

🧨 DEVIL'S ADVOCATE OBJECTION
The initial defensive plan was heavily criticized by our tactical devil as too safe, allowing the batsmen to settle on a {pitch} surface.

🔁 CAPTAIN'S RESPONSE
The captain agreed with the critique, discarding the passive lines and opting for a high-intensity attack.

📊 MATCH METRICS
- Current RR: {stats.get('current_run_rate')}
- Required RR: {stats.get('required_run_rate')}
- Win Probability: {stats.get('win_probability')}% ({batting_team})
- Suggested Bowling: {stats.get('suggested_bowling_type').upper()}
- Pressure: {stats.get('pressure')}

🎯 CONFIDENCE SCORE
0.95"""

    return {
        "stats": stats,
        "analyst_response": analyst_response.strip(),
        "strategist_initial": strategist_initial.strip(),
        "devil_response": devil_response.strip(),
        "strategist_final": strategist_final.strip(),
        "final_output": final_output.strip(),
        "fallback": not force_clean
    }

@app.get("/")
def read_root():
    return {
        "status": "online",
        "project": "Captain Cool — Multi-Agent IPL Match Strategist",
        "api_key_configured": os.getenv("GEMINI_API_KEY") is not None
    }

@app.post("/strategy")
def get_match_strategy(
    match_state: MatchState, 
    x_gemini_key: str = Header(None),
    x_presentation_mode: str = Header(None)
):
    """
    POST endpoint that runs the full multi-agent debate loop with header API key override,
    presentation demo mode, and graceful dynamic mock fallback when rate limits are hit.
    """
    global client
    
    # 1. Calculate offline math metrics (always works offline)
    stats = calculate_win_probability(
        innings=match_state.innings,
        over=match_state.over,
        score=match_state.score,
        wickets=match_state.wickets,
        pitch=match_state.pitch,
        dew=match_state.dew,
        powerplay=match_state.powerplay,
        death_overs=match_state.death_overs,
        target=match_state.target
    )
    
    match_state_dict = match_state.model_dump()

    # 2. Check if clean Simulated Presentation Mode is requested
    if x_presentation_mode == "simulated":
        logger.info("Serving match strategy from local simulation engine (Clean Presentation Mode).")
        return generate_mock_strategy(match_state_dict, stats, force_clean=True)

    # 3. Determine active client (default vs custom header API key)
    active_client = client
    if x_gemini_key:
        try:
            logger.info("Using custom Gemini API key provided by headers.")
            active_client = genai.Client(api_key=x_gemini_key)
        except Exception as e:
            logger.error(f"Failed to initialize custom Gemini Key: {e}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to initialize provided Gemini Key: {str(e)}"
            )

    if not active_client:
        # Retry initialization using .env
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            active_client = genai.Client(api_key=api_key)
        else:
            raise HTTPException(
                status_code=500,
                detail="Gemini API Key is not configured. Please set GEMINI_API_KEY in your .env file or input your key in the UI."
            )

    try:
        logger.info(f"Received Match State: innings={match_state.innings}, over={match_state.over}, score={match_state.score}, wickets={match_state.wickets}")

        # B) Analyst agent
        logger.info("Invoking Stats Analyst Agent...")
        analyst_response = run_analyst(active_client, match_state_dict)

        # C) Strategist initial
        logger.info("Invoking Captain Strategist (Initial Plan)...")
        strategist_initial = run_strategist_initial(active_client, match_state_dict, analyst_response)

        # D) Devil agent
        logger.info("Invoking Devil's Advocate...")
        devil_response = run_devil(active_client, match_state_dict, analyst_report=analyst_response, initial_plan=strategist_initial)

        # E) Strategist final
        logger.info("Invoking Captain Strategist (Final Plan)...")
        strategist_final = run_strategist_final(
            client=active_client,
            match_state=match_state_dict,
            analyst_report=analyst_response,
            initial_plan=strategist_initial,
            devil_objection=devil_response
        )

        # F) Commentator
        logger.info("Invoking IPL Commentator...")
        final_output = run_commentator(
            client=active_client,
            match_state=match_state_dict,
            tool_output=stats,
            analyst_report=analyst_response,
            initial_plan=strategist_initial,
            devil_objection=devil_response,
            final_plan=strategist_final
        )

        return {
            "stats": stats,
            "analyst_response": analyst_response,
            "strategist_initial": strategist_initial,
            "devil_response": devil_response,
            "strategist_final": strategist_final,
            "final_output": final_output,
            "fallback": False
        }

    except Exception as e:
        err_msg = str(e)
        logger.error(f"Error in debate loop: {err_msg}")
        
        # 4. Detect Quota / Rate limit (429) triggers and perform mock fallback
        if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg or "quota" in err_msg.lower() or "limit" in err_msg.lower():
            logger.warning("Gemini 429 rate limit detected! Gracefully falling back to pre-calculated simulation mode.")
            return generate_mock_strategy(match_state_dict, stats, force_clean=False)
            
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while generating the match strategy: {err_msg}"
        )

from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class Bowler(BaseModel):
    name: str = Field(..., description="Name of the bowler")
    overs_used: float = Field(..., description="Number of overs bowled by this bowler so far (e.g. 2.4)")
    type: Literal["pace", "spin"] = Field(..., description="Type of bowler: 'pace' or 'spin'")

class MatchState(BaseModel):
    innings: Literal[1, 2] = Field(..., description="Current innings: 1 (setting score) or 2 (chasing)")
    over: float = Field(..., description="Current over in the match (e.g., 14.2 which means 14 overs and 2 balls bowled)")
    score: int = Field(..., description="Current runs scored by the batting team")
    wickets: int = Field(..., description="Current wickets lost by the batting team (0 to 10)")
    target: Optional[int] = Field(None, description="Target score to win, required if innings is 2")
    batting_team: str = Field(..., description="Name of the batting team")
    bowling_team: str = Field(..., description="Name of the bowling team")
    striker: str = Field(..., description="Name of the batsman currently on strike")
    non_striker: str = Field(..., description="Name of the batsman at the non-striker's end")
    pitch: Literal["flat", "turning", "two-paced"] = Field(..., description="Pitch condition: 'flat', 'turning', or 'two-paced'")
    dew: Literal["low", "medium", "high"] = Field(..., description="Dew factor: 'low', 'medium', or 'high'")
    powerplay: bool = Field(..., description="Is the powerplay currently active?")
    death_overs: bool = Field(..., description="Are we in the death overs (last 4 overs, i.e., over >= 16.0)?")
    impact_player_available: bool = Field(..., description="Is the batting or bowling team's impact player still available to be introduced?")
    bowlers: List[Bowler] = Field(..., description="List of bowlers available in the bowling team, along with their stats")

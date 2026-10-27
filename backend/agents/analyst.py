from google import genai
from google.genai import types
from tools.winprob import calculate_win_probability

def run_analyst(client: genai.Client, match_state: dict) -> str:
    """
    Invokes the Analyst Agent using Gemini 2.5 Flash with automatic function calling.
    
    Args:
        client: The google-genai client instance.
        match_state: A dictionary containing the current match state matching schemas.MatchState.
        
    Returns:
        str: Factual, numbers-driven analysis including tool outputs.
    """
    # Setup prompt that encourages the agent to call the tool
    prompt = (
        "Please analyze this IPL match state. You MUST first call the `calculate_win_probability` function "
        "to calculate the win probability, pressure, run rates, and recommended bowling type.\n"
        "Once you have the tool outputs, provide a sharp, factual, numbers-driven analysis. "
        "Focus on statistical matchups, phase strategy, and bowler utilization.\n\n"
        f"Match State: {match_state}"
    )
    
    # Configure the Gemini agent with system instructions and tools
    config = types.GenerateContentConfig(
        system_instruction=(
            "You are Stats Analyst for an IPL team. You are factual, sharp, and numbers-driven. "
            "You do NOT speak like a commentator. You analyze match state and tool output. "
            "You suggest best matchups and phase strategy."
        ),
        tools=[calculate_win_probability],
        temperature=0.1,  # Keep it factual and deterministic
    )
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=config
    )
    
    return response.text

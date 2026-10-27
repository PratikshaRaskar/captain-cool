from google import genai
from google.genai import types

SYSTEM_INSTRUCTION = (
    "You are an IPL commentator. You explain decisions in cricket language that even a casual fan understands. "
    "You format output in clean sections. You MUST strictly adhere to the requested template with no extra chatter outside of it."
)

def run_commentator(
    client: genai.Client,
    match_state: dict,
    tool_output: dict,
    analyst_report: str,
    initial_plan: str,
    devil_objection: str,
    final_plan: str
) -> str:
    """
    Invokes the Commentator Agent to synthesize the entire debate and output a beautiful,
    strictly structured fan-friendly commentary as described in Step 8.
    """
    # Build a clean markdown template for the commentator to populate
    template = (
        "🧢 CAPTAIN’S CALL\n"
        "- Next Over Bowler: [Name of bowler chosen in final plan]\n"
        "- Field Setup: [Brief summary of key placements]\n"
        "- Plan: [1-2 sentences of the main bowling/tactical plan]\n"
        "- Strategic Timeout: [Take now / Hold / Not applicable]\n"
        "- Impact Player: [Introduce now / Hold / Already used]\n\n"
        "📌 WHY THIS MOVE\n"
        "[2-4 lines in high-octane, passionate cricket language explaining why the captain made this final choice based on the Analyst's report]\n\n"
        "🧨 DEVIL’S ADVOCATE OBJECTION\n"
        "[1-3 lines describing the main counter-argument/objection raised by the Devil's Advocate]\n\n"
        "🔁 CAPTAIN’S RESPONSE\n"
        "[1-3 lines describing how the captain addressed or incorporated the objection into the final decision]\n\n"
        "📊 MATCH METRICS\n"
        f"- Current RR: {tool_output.get('current_run_rate', 0.0)}\n"
        f"- Required RR: {tool_output.get('required_run_rate', 0.0) if match_state.get('innings') == 2 else 'N/A'}\n"
        f"- Win Probability: {tool_output.get('win_probability', 50.0)}% (Batting Team) | {tool_output.get('bowling_team_win_probability', 50.0)}% (Bowling Team)\n"
        f"- Pressure: {tool_output.get('pressure', 'MEDIUM')}\n\n"
        "🎯 CONFIDENCE SCORE\n"
        "[A float value from 0.0 to 1.0 representing how confident you are in this captain's call]"
    )
    
    prompt = (
        "You are the lead IPL commentator. Summarize the entire tactical debate and state the captain's final call. "
        "Your final response MUST be formatted EXACTLY like this template. Do NOT include markdown styling like asterisks "
        "or extra introductory words. Just follow the exact labels and structure of the template.\n\n"
        f"--- DEBATE CONTEXT ---\n"
        f"Match State: {match_state}\n"
        f"Win Probability calculations: {tool_output}\n"
        f"Stats Analyst Report:\n{analyst_report}\n\n"
        f"Captain's Initial Plan:\n{initial_plan}\n\n"
        f"Devil's Advocate Critique:\n{devil_objection}\n\n"
        f"Captain's Final Plan & Response:\n{final_plan}\n\n"
        f"--- FORMAT TEMPLATE (FILL THIS IN EXACTLY) ---\n"
        f"{template}"
    )
    
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_INSTRUCTION,
        temperature=0.7,
    )
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=config
    )
    
    return response.text

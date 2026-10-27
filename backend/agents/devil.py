from google import genai
from google.genai import types

def run_devil(client: genai.Client, match_state: dict, analyst_report: str, initial_plan: str) -> str:
    """
    Invokes the Devil's Advocate Agent to critique the Strategist's initial plan.
    
    Args:
        client: The google-genai client.
        match_state: The current match state.
        analyst_report: The analyst's insights.
        initial_plan: The strategist's initial proposal.
        
    Returns:
        str: Critique and tactical counter-proposals.
    """
    prompt = (
        "Analyze the captain's initial tactical plan and find the critical flaws, blind spots, or "
        "vulnerabilities in it. You MUST disagree, explain why their plan could backfire, "
        "and propose a tactical and aggressive alternative plan that exploits their strategy.\n\n"
        f"Match State: {match_state}\n\n"
        f"Stats Analyst Report:\n{analyst_report}\n\n"
        f"Captain's Initial Plan:\n{initial_plan}\n\n"
        "Critique their bowling choice, field placement, and match-ups. Propose your aggressive alternative."
    )
    
    config = types.GenerateContentConfig(
        system_instruction=(
            "You are Devil’s Advocate (opposition strategist). Your job is to disagree and find weaknesses. "
            "You must propose a better alternative plan. You are tactical and aggressive."
        ),
        temperature=0.8, # More creative/aggressive
    )
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=config
    )
    
    return response.text

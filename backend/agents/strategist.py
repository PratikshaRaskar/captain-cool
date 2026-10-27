from google import genai
from google.genai import types

SYSTEM_INSTRUCTION = (
    "You are the IPL Captain Strategist. You make decisive tactical calls like Dhoni/Rohit/Hardik. "
    "You must output clear captain decisions: bowler choice, field placement, timeout call, impact player usage."
)

def run_strategist_initial(client: genai.Client, match_state: dict, analyst_report: str) -> str:
    """
    Produces the initial tactical plan proposed by the Strategist Agent (Captain).
    """
    prompt = (
        "As the Captain, review the live match state and the Stats Analyst's report. "
        "Formulate your INITIAL tactical plan. You must be decisive, clear, and focused on "
        "winning the next phase of the match.\n\n"
        f"Match State: {match_state}\n\n"
        f"Stats Analyst Report:\n{analyst_report}\n\n"
        "Provide your proposed decisions on:\n"
        "1. Next Bowler to employ (and why)\n"
        "2. Key Field Placements (e.g. deep midwicket, slip, fine leg)\n"
        "3. Tactical Timeout plans (if applicable)\n"
        "4. Impact Player introduction plans (if applicable)"
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

def run_strategist_final(
    client: genai.Client, 
    match_state: dict, 
    analyst_report: str, 
    initial_plan: str, 
    devil_objection: str
) -> str:
    """
    Produces the final tactical plan after defending/revising against the Devil's Advocate's attack.
    """
    prompt = (
        "You proposed an initial tactical plan, but the Devil's Advocate (opposition strategist) has attacked it, "
        "pointing out significant weaknesses and proposing an alternative.\n\n"
        f"Match State: {match_state}\n\n"
        f"Stats Analyst Report:\n{analyst_report}\n\n"
        f"Your Initial Plan:\n{initial_plan}\n\n"
        f"Devil's Advocate Objection:\n{devil_objection}\n\n"
        "Now, make your FINAL decision. Respond to the objections: either defend your original plan with "
        "strong reasoning or revise it to address the vulnerabilities. Be extremely decisive and sharp, "
        "speaking with the confidence and maturity of a master IPL captain. Clearly output your final, "
        "concrete decisions on Bowler Choice, Field Setup, Timeout, and Impact Player."
    )
    
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_INSTRUCTION,
        temperature=0.6,
    )
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=config
    )
    
    return response.text

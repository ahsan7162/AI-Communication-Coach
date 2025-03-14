from prompts.get_profile_from_message_prompt import PROMPT_TEMPLATE
import json
from services.llm import get_response_from_llm

def get_user_profile_from_message(userprofile, message: str):
    prompt = PROMPT_TEMPLATE.replace("{{profile}}", json.dumps(userprofile, indent=4))
    prompt = prompt.replace("{{message}}", message)
    
    return get_response_from_llm(prompt)
    
    

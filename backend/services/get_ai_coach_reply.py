import json
from services.llm import send_chat_message


def get_ai_coach_reply(message: str):
    response = send_chat_message(message)
    return json.loads(response).get("response")
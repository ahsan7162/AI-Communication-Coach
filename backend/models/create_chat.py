from pydantic import BaseModel

class ChatCreate(BaseModel):
    chat_name: str
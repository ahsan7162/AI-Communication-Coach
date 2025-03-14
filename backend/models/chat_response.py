from pydantic import BaseModel

# Pydantic Model for Chat Response
class ChatResponse(BaseModel):
    id: int
    chat_name: str

    class Config:
        from_attributes = True
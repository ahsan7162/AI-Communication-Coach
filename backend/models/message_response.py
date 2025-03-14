from pydantic import BaseModel


# Pydantic Model for Message Response
class MessageResponse(BaseModel):
    id: int
    content: str
    message_type: str
    chat_id: int

    class Config:
        from_attributes = True
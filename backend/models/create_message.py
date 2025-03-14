from pydantic import BaseModel
from models.enums import MessageTypeEnum
from typing import Optional

class MessageCreate(BaseModel):
    chat_id: int
    content: str
    message_type: Optional[MessageTypeEnum] = None
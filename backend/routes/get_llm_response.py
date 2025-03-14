# will get any context for user profile
# set that data in user profile column
# then using the user profile and the current messsage will get a response from llm 
# if message is related to a communication chat bot then get a response from llm otherwise send a generic reply that it is not related to communication bot

from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from database.db_setup import Chat, Message, User
from database.get_db import get_db
from helpers.get_user_from_jwt import get_current_user
from models.chat_response import ChatResponse
from models.message_response import MessageResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.chat_message import ChatMessage 
from models.create_message import MessageCreate
from services.get_context_from_message import get_user_profile_from_message
from services.get_ai_coach_reply import get_ai_coach_reply
from models.enums import MessageTypeEnum
import json


router = APIRouter()
security = HTTPBearer()

@router.post("/llm", response_model=MessageCreate)
def create_chat(user_message: MessageCreate, credentials: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)):
    user = get_current_user(credentials, db)
    
    user_new_message = Message(chat_id=user_message.chat_id, content= user_message.content, message_type=MessageTypeEnum.HUMAN)
    db.add(user_new_message)
    db.commit()
    db.refresh(user_new_message)
    
    updated_profile = get_user_profile_from_message(user.profile, user_message.content)
    if updated_profile is None:
        print("Line 40")
        user.profile = ""
    else:
        print("Line 42")
        user.profile = updated_profile
    updated_user = db.query(User).filter(user.id == User.id).first()
    updated_user.profile = updated_profile
    db.commit()
    db.refresh(updated_user)
    
    coach_response = get_ai_coach_reply(user_message.content)
    new_message = Message(chat_id=user_message.chat_id, content= coach_response, message_type=MessageTypeEnum.AICOACH)
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return MessageCreate(chat_id=user_message.chat_id ,content = coach_response, message_type=MessageTypeEnum.AICOACH)
    
    
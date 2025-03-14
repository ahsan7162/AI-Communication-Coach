from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from database.db_setup import Chat, Message
from database.get_db import get_db
from helpers.get_user_from_jwt import get_current_user
from models.chat_response import ChatResponse
from models.message_response import MessageResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.create_chat import ChatCreate
from models.create_message import MessageCreate
from models.enums import MessageTypeEnum
from prompts.coach_prompt import ENGLISH_COACH_PROMPT
from services.llm import start_chat
import json

router = APIRouter()
security = HTTPBearer()



@router.post("/user/chats", response_model=list[ChatResponse])
def get_user_chats(credentials: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)):
    user = get_current_user(credentials, db)
    chats = db.query(Chat).filter(Chat.user_id == user.id).all()
    chat_responses = [ChatResponse(id= chat.id, chat_name =  chat.name) for chat in chats]
    return chat_responses

@router.get("/chat/{chat_id}/messages", response_model=list[MessageResponse])
def get_chat_messages(chat_id: int, credentials: HTTPAuthorizationCredentials = Security(security),db: Session = Depends(get_db)):
    user = get_current_user(credentials, db)
    messages = db.query(Message).filter(Message.chat_id == chat_id).all()
    message_responses = [
        MessageResponse(
            id=message.id,
            content=message.content,
            message_type=message.message_type,
            chat_id=message.chat_id
        ) for message in messages
    ]
    return message_responses

@router.post("/chat/create", response_model=ChatResponse)
def create_chat(chat_data: ChatCreate, credentials: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)):
    try:
        user = get_current_user(credentials, db)
        new_chat = Chat(user_id=user.id, name=chat_data.chat_name)
        db.add(new_chat)
        db.commit()
        db.refresh(new_chat)
        return ChatResponse(chat_name=new_chat.name, id= new_chat.id) 
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/message/create", response_model=MessageResponse)
def create_message(message_data: MessageCreate,  credentials: HTTPAuthorizationCredentials = Security(security),db: Session = Depends(get_db)):
    user = get_current_user(credentials, db)
    chat = db.query(Chat).filter(Chat.id == message_data.chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    new_message = Message(chat_id=message_data.chat_id, content=message_data.content, message_type=message_data.message_type)
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@router.post("/start/chat")
async def create_message(chat_id: int,  credentials: HTTPAuthorizationCredentials = Security(security),db: Session = Depends(get_db)):
    user = get_current_user(credentials, db)
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    messages = db.query(Message).filter(Message.chat_id == chat.id).all()
    
    existing_history = [
        {"role": "user", "parts": [msg.content]}
        for msg in messages if msg.message_type == MessageTypeEnum.HUMAN
    ]

    prompt = ENGLISH_COACH_PROMPT.replace("{{user_profile}}", json.dumps(user.profile, indent=4))

    start_chat(prompt, existing_history)
    
    return ("chat_initialized")

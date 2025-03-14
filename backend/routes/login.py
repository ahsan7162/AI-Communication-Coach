from database.db_setup import User
from database.get_db import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from models.login_request import LoginRequest
import jwt
import datetime
import os


# JWT Secret Key
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: datetime.timedelta):
    to_encode = data.copy()
    expire = datetime.datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



# Router Setup
router = APIRouter()

@router.post("/api/login/")
def login(user_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter((User.email == user_data.identifier) | (User.name == user_data.identifier)).first()
    if not user or not pwd_context.verify(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": user.email}, expires_delta=datetime.timedelta(hours=3))
    return {"access_token": access_token, "token_type": "bearer"}
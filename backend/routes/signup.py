from database.db_setup import User,engine
from database.get_db import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from models.signup_request import SignupRequest
from sqlalchemy import inspect

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")




# Router Setup
router = APIRouter()

# Signup API
@router.post("/api/signup/")
def signup(user_data: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user_data.password)
    new_user = User(name=user_data.name, email=user_data.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}
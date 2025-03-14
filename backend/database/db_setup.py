from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Text,Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from models.enums import MessageTypeEnum 


# Configuration (SQLite Database File)
DB_NAME = os.getenv("DB_NAME", "aicoach.db")
DATABASE_URL = f"sqlite:///./{DB_NAME}"

# Database Engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# Define Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    profile = Column(Text, nullable=True)  # JSON string containing key-value pairs

    chats = relationship("Chat", back_populates="user", cascade="all, delete")

class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name  = Column(String, index=True, nullable=False)
    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat", cascade="all, delete")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    message_type = Column(Enum(MessageTypeEnum), nullable=False)
    chat = relationship("Chat", back_populates="messages")


def create_tables():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

# Create Tables if Script is Run Directly
if __name__ == "__main__":
    create_tables()
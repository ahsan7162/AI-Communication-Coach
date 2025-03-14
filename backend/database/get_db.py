from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
# Dependency to get database session
DB_NAME = os.getenv("DB_NAME", "aicoach.db")
DATABASE_URL = f"sqlite:///./{DB_NAME}"

# Database Engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
def get_db():
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

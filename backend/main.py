from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.signup import router as signup
from routes.home import router as home
from routes.login import router as login
from routes.chat import router as chat
from routes.get_llm_response import router as llm
from database.db_setup import create_tables
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(home)
app.include_router(signup)
app.include_router(login)
app.include_router(chat)
app.include_router(llm)

if __name__ == "__main__":
    create_tables()
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)

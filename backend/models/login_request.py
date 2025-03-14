from pydantic import BaseModel


class LoginRequest(BaseModel):
    identifier: str  # Can be either email or username
    password: str
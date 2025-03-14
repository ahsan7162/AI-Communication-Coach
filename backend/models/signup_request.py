from pydantic import BaseModel

# Pydantic Model for Signup
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
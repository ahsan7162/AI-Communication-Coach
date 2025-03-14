from pydantic import BaseModel


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    profile: str | None

    class Config:
        from_attributes = True
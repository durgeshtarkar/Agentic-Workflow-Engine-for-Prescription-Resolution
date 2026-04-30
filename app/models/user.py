from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "doctor"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    email: str
    full_name: str
    role: str

class UserUpdate(BaseModel):
    full_name: str
    current_password: Optional[str] = None
    new_password: Optional[str] = None

from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PrescriptionProcess(BaseModel):
    raw_text: str
    patient_id: str
    target_language: Optional[str] = "English"

class ChatRequest(BaseModel):
    prescription_id: str
    agent_role: str
    question: str

class StatusUpdate(BaseModel):
    status: str

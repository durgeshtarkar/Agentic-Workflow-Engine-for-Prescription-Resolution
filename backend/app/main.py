from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth_routes, prescription_routes, patient_routes

app = FastAPI(title="Agentic Prescription System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(prescription_routes.router, prefix="/prescription", tags=["prescription"])
app.include_router(patient_routes.router, prefix="/patients", tags=["patients"])

@app.get("/")
def home():
    return {"message": "Agentic FastAPI backend running"}

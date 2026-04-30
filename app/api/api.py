from fastapi import APIRouter
from app.api.endpoints import auth, prescriptions, drugs

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(prescriptions.router, prefix="/prescriptions", tags=["prescriptions"])
api_router.include_router(drugs.router, prefix="/drugs", tags=["pharmacology"])

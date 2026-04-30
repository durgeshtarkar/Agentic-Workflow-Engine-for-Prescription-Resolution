from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, status
from app.services.agent_workflow import run_agentic_analysis
from app.api.deps import get_current_user
from app.services.database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from bson import ObjectId
import json

router = APIRouter()

from app.models.prescription import PrescriptionProcess, ChatRequest, StatusUpdate

async def save_analysis(final_output, current_user, db, filename):
    analysis_record = {
        "user_id": current_user["_id"],
        "filename": filename,
        "created_at": datetime.utcnow(),
        "analysis": final_output
    }
    # Ensure status field exists
    if "status" not in analysis_record["analysis"]:
        analysis_record["analysis"]["status"] = "success"
    
    result = await db.prescriptions.insert_one(analysis_record)
    analysis_record["_id"] = str(result.inserted_id)
    analysis_record["user_id"] = str(analysis_record["user_id"])
    return analysis_record

@router.post("/upload")
async def upload_prescription(
    file: UploadFile = File(...),
    target_language: str = Form("English"),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    contents = await file.read()
    final_output = await run_agentic_analysis(image_bytes=contents, target_language=target_language)
    return await save_analysis(final_output, current_user, db, file.filename)

@router.post("/upload-demo")
async def upload_prescription_demo(
    file: UploadFile = File(...)
):
    """Demo endpoint for testing - no authentication required"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    contents = await file.read()
    final_output = await run_agentic_analysis(image_bytes=contents)
    return {
        "status": "success",
        "analysis": final_output,
        "filename": file.filename,
        "created_at": datetime.utcnow().isoformat()
    }

@router.post("/process")
async def process_text_prescription(
    data: PrescriptionProcess,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    final_output = await run_agentic_analysis(raw_text=data.raw_text, target_language=data.target_language)
    return await save_analysis(final_output, current_user, db, "Manual Entry")

@router.post("/process-demo")
async def process_text_prescription_demo(
    data: PrescriptionProcess
):
    """Demo endpoint for testing - no authentication required"""
    final_output = await run_agentic_analysis(raw_text=data.raw_text)
    return {
        "status": "success",
        "analysis": final_output,
        "patient_id": data.patient_id,
        "created_at": datetime.utcnow().isoformat()
    }

@router.get("/history")
async def get_history(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    cursor = db.prescriptions.find({"user_id": current_user["_id"]}).sort("created_at", -1)
    history = await cursor.to_list(length=100)
    for item in history:
        item["_id"] = str(item["_id"])
        item["user_id"] = str(item["user_id"])
    return history

@router.get("/timeline/{patient_name}")
async def get_patient_timeline(
    patient_name: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Search for records where patient name is a match (case insensitive)
    cursor = db.prescriptions.find({
        "user_id": current_user["_id"],
        "analysis.patient_info.name": {"$regex": patient_name, "$options": "i"}
    }).sort("created_at", 1)
    
    records = await cursor.to_list(length=100)
    timeline = []
    
    for r in records:
        analysis = r.get("analysis", {})
        meds = analysis.get("medications", [])
        for m in meds:
            timeline.append({
                "record_id": str(r["_id"]),
                "prescribed_at": r["created_at"].isoformat(),
                **m
            })
    return timeline

def validate_object_id(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid clinical record ID format")
    return ObjectId(id)

@router.delete("/{id}")
async def delete_prescription(
    id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    obj_id = validate_object_id(id)
    result = await db.prescriptions.delete_one({"_id": obj_id, "user_id": current_user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"message": "Record deleted"}

@router.patch("/{id}/status")
async def update_status(
    id: str,
    data: StatusUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    obj_id = validate_object_id(id)
    await db.prescriptions.update_one(
        {"_id": obj_id, "user_id": current_user["_id"]},
        {"$set": {"analysis.status": data.status}}
    )
    return {"message": "Status updated"}

@router.post("/chat")
async def chat_with_agent(
    data: ChatRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Retrieve clinical context
    obj_id = validate_object_id(data.prescription_id)
    px = await db.prescriptions.find_one({"_id": obj_id})
    if not px:
        raise HTTPException(status_code=404, detail="Clinical record not found")

    from app.services.ai_service import get_ai_service
    ai = get_ai_service()
    context = json.dumps(px.get('analysis', {}))
    answer = await ai.chat(context, data.question, role=data.agent_role)
    return {"answer": answer}

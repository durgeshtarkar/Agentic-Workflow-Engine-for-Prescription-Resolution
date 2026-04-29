from fastapi import APIRouter, HTTPException, Query
from app.services.ai_service import get_ai_service
import json

router = APIRouter()
ai_service = get_ai_service()

import re

@router.get("/lookup")
async def lookup_drug(
    name: str = Query(..., description="Name of the drug to look up"),
    lang: str = Query("English", description="Target language for the fact sheet")
):
    prompt = f"""
    Act as a Senior Clinical Pharmacologist. Generate a professional 'Drug Fact Sheet' for the following medication: {name}
    
    IMPORTANT: Write the entire fact sheet in {lang}.
    
    Structure the response in JSON format:
    {{
      "drug_name": "string (in {lang})",
      "category": "string (in {lang})",
      "usage": "Detailed clinical usage and indications (in {lang})",
      "common_dosages": ["string (in {lang})"],
      "side_effects": ["string (in {lang})"],
      "brand_alternatives": ["string (in {lang})"],
      "contraindications": ["string (in {lang})"],
      "clinical_pearl": "One high-value clinical tip (in {lang})"
    }}
    
    Return ONLY the JSON object.
    """
    system_role = f"You are a Senior Clinical Pharmacologist. Respond with structured clinical data in {lang}."
    try:
        response_text = await ai_service.generate_content(prompt, system_role=system_role)
        
        # Robust JSON extraction using regex
        json_match = re.search(r'(\{.*\})', response_text, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group(1))
            return data
        else:
            # Fallback for direct JSON strings
            data = json.loads(response_text.strip())
            return data
            
    except Exception as e:
        print(f"Drug lookup error: {e}")
        error_detail = str(e) if "detail" not in str(e) else "AI interpretation failed."
        raise HTTPException(status_code=500, detail=f"Clinical analysis failed: {error_detail}")

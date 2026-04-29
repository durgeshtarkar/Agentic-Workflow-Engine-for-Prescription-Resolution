import json
import re
import asyncio
import httpx
import os
import base64
from datetime import datetime
from app.core.config import get_settings
from PIL import Image, ImageEnhance, ImageFilter
import io

try:
    import pytesseract
    # Default path for Tesseract on Windows
    tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    if os.path.exists(tesseract_cmd):
        pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
except ImportError:
    pytesseract = None

settings = get_settings()

class AIService:
    def __init__(self):
        self.provider = "none" # groq or none
        self.live_mode = False
        self._initialize_provider()

    def _initialize_provider(self):
        """Initialize Groq as the primary free resource provider."""
        if settings.GROQ_API_KEY and len(settings.GROQ_API_KEY) > 10:
            self.provider = "groq"
            self.live_mode = True
            print("AI Service: Successfully linked with Groq (Primary Provider)")
        else:
            print("AI Service: CRITICAL - No API key found. AI features will be disabled.")
            self.live_mode = False

    def _get_error_response(self, message: str, score: int = 0) -> str:
        """Standardized error response instead of mock data."""
        return json.dumps({
            'patient_info': {'name': 'Analysis Failed', 'age': 'N/A'},
            'clinical_assessment': {
                'summary': message,
                'warnings': ['Could not process prescription reliably.'],
                'confidence_score': score
            },
            'medications': [],
            'doctor_info': {'name': 'N/A', 'date': datetime.utcnow().strftime('%Y-%m-%d')}
        })

    async def _call_groq(self, prompt: str, system_prompt: str = None, require_json: bool = True):
        """Internal helper to call Groq API (OpenAI Compatible)."""
        if not system_prompt:
            system_prompt = "You are a professional Medical AI. Extract prescription data into structured JSON. If input is invalid, return empty structures."
            
        async with httpx.AsyncClient() as client:
            try:
                payload = {
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.1
                }
                
                if require_json:
                    payload["response_format"] = {"type": "json_object"}

                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json=payload,
                    timeout=45.0
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"Groq API Error: {e}")
                raise e

    async def _call_groq_vision(self, image_base64: str, prompt: str, system_role: str = None):
        """Call Groq with vision capabilities for image analysis."""
        if not system_role:
             system_role = "You are a professional Medical AI. Extract prescription data into structured JSON."
             
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
                        "messages": [
                            {"role": "system", "content": system_role},
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": prompt
                                    },
                                    {
                                        "type": "image_url",
                                        "image_url": {
                                            "url": f"data:image/jpeg;base64,{image_base64}"
                                        }
                                    }
                                ]
                            }
                        ],
                        "max_tokens": 1500,
                        "temperature": 0.1,
                        "response_format": {"type": "json_object"}
                    },
                    timeout=60.0
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"Groq Vision API Error: {e}")
                raise e

    async def analyze_text(self, text: str, system_role: str = None):
        if not self.live_mode:
            return self._get_error_response("AI Service configuration missing.")

        prompt = self._get_prompt() + f"\n\nPRESCRIPTION TEXT:\n{text}"
        try:
            return await self._call_groq(prompt, system_prompt=system_role)
        except Exception as e:
            print(f"Analysis Error: {e}")
            return self._get_error_response(f"AI Analysis error: {str(e)}")

    async def analyze_prescription(self, image_bytes: bytes, system_role: str = None):
        """Main entry point for image analysis. Tries OCR first, falls back to Groq Vision."""
        if not self.live_mode:
            return self._get_error_response("AI Service offline.")

        # Try Groq Vision API first (most reliable) with Chain of Thought
        try:
            # Optimize image for Vision API (Resize if too large, convert to JPEG for better compatibility)
            img = Image.open(io.BytesIO(image_bytes))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Max dimension 1024 for reliability with Groq Vision
            max_size = 1024
            if max(img.width, img.height) > max_size:
                ratio = max_size / max(img.width, img.height)
                new_size = (int(img.width * ratio), int(img.height * ratio))
                img = img.resize(new_size, Image.LANCZOS)
            
            buffered = io.BytesIO()
            img.save(buffered, format="JPEG", quality=85)
            optimized_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            # Enhanced Vision Prompt
            vision_prompt = f"""
            {self._get_prompt()}
            
            DIAGNOSTIC STEP:
            1. First, read all the text you can see on the prescription, even if it is messy handwriting.
            2. Identify the patient name, age, and each medication name/dosage.
            3. Then, format the identified data into the required JSON structure.
            4. If a word is partially illegible, use medical context to infer the most likely medication name.
            """
            
            result = await self._call_groq_vision(optimized_base64, vision_prompt, system_role=system_role)
            print(f"Vision API Result: {result}")
            return result
        except Exception as e:
            print(f"Groq Vision failed: {e}, attempting OCR fallback...")

        # Fallback to local OCR if vision API fails
        extracted_text = ""
        if pytesseract is not None:
            try:
                image = Image.open(io.BytesIO(image_bytes))
                image = image.convert('L')
                image = image.filter(ImageFilter.MedianFilter())
                image = ImageEnhance.Contrast(image).enhance(2.0)
                image = image.resize((image.width * 2, image.height * 2), Image.LANCZOS)

                extracted_text = await asyncio.to_thread(
                    pytesseract.image_to_string,
                    image,
                    config='--psm 6'
                )

                if not extracted_text.strip():
                    enhanced = image.point(lambda x: 0 if x < 150 else 255, '1')
                    extracted_text = await asyncio.to_thread(
                        pytesseract.image_to_string,
                        enhanced,
                        config='--psm 6'
                    )

                print(f"OCR Extracted Text: {repr(extracted_text.strip())}")
            except Exception as e:
                print(f"OCR Error: {e}")

        if not extracted_text.strip():
            return self._get_error_response("Could not extract prescription text from image. Please try a clearer photo or type the prescription manually.")

        return await self.analyze_text(extracted_text)

    async def chat(self, context: str, question: str, role: str = "Clinical Agent"):
        if not self.live_mode:
            return f"{role}: System is currently offline."

        prompt = f"Context: {context}\nPatient Question: {question}"
        system_prompt = f"You are a {role}. Provide clear medical insights based on the context provided. Use natural language, not JSON."
        try:
            return await self._call_groq(prompt, system_prompt=system_prompt, require_json=False)
        except Exception as e:
            return f"{role}: Error connecting to processing service."

    async def generate_content(self, prompt: str, system_role: str = None):
        if not self.live_mode: return "Error: AI not configured."
        try:
            return await self._call_groq(prompt, system_prompt=system_role)
        except Exception as e:
            return f"Error: {str(e)}"

    def _get_prompt(self):
        return """
        Act as a Professional Global Clinical Data Extractor and Medical Translator.
        Analyze the provided prescription (text or image) and extract all relevant information.
        
        MULTI-LANGUAGE RULES:
        1. Support for global scripts: If the prescription is in Hindi (Devanagari), Spanish, Arabic, or any other language, identify the linguistic script.
        2. AUTOMATIC TRANSLATION: Translate ALL findings (patient info, dosages, instructions) into PROFESSIONAL MEDICAL ENGLISH for the final JSON.
        3. MEDICATION MATCHING: Identify the pharmacological drug name even if written in a local language or brand name.
        
        CRITICAL RULES:
        1. "clinical_assessment.summary": Provide a concise professional summary in English.
        2. "clinical_assessment.confidence_score": Base this on how much data YOU found and OCR clarity.
        3. EXTRACT EVERYTHING POSSIBLE: Even if data is sparse, include what is available.
        4. Return ONLY valid JSON.
        
        STRUCTURE:
        {
          "patient_info": { "name": "string", "age": "string" },
          "clinical_assessment": {
            "summary": "Detailed English clinical summary...",
            "warnings": ["warning 1", "warning 2"],
            "confidence_score": 95
          },
          "medications": [
            { 
              "name": "English Drug Name", 
              "dosage": "string", 
              "frequency": "string", 
              "instructions": "Translated instructions",
              "duration_days": "integer (estimated number of days if mentioned)",
              "start_date": "YYYY-MM-DD (estimated start date)"
            }
          ],
          "doctor_info": { "name": "string", "date": "string" }
        }
        """

ai_service = AIService()

def get_ai_service():
    return ai_service

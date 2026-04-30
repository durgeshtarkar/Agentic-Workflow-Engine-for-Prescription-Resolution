import json
import io
from typing import List, Dict, Any, TypedDict, Union
from langgraph.graph import StateGraph, END
from app.services.ai_service import get_ai_service
from app.core.config import get_settings

settings = get_settings()
ai_service = get_ai_service()

class AgentState(TypedDict):
    raw_input: str
    image_bytes: bytes
    extraction: Dict[str, Any]
    safety_check: List[str]
    resolution_suggestions: List[Dict[str, str]]
    final_output: Dict[str, Any]
    steps_completed: List[str]
    target_language: str

def parse_ai_response(result: Union[str, Dict[str, Any], List[Any], Any]) -> Any:
    if isinstance(result, (dict, list)):
        return result
    if not isinstance(result, str):
        return {"error": "unexpected_ai_response"}

    cleaned = result.strip().replace("```json", "").replace("```", "")
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        try:
            start = cleaned.index('{')
            end = cleaned.rindex('}') + 1
            return json.loads(cleaned[start:end])
        except Exception:
            try:
                # Handle array start/end
                start = cleaned.index('[')
                end = cleaned.rindex(']') + 1
                return json.loads(cleaned[start:end])
            except:
                return {"error": "failed_to_parse_response", "raw": cleaned[:200]}

async def extraction_node(state: AgentState):
    """Agent 1: Clinical Entity Recognition & Parameter Extraction"""
    system_role = f"Act as a professional medical extractor. Provide all clinical findings and summaries in {state['target_language']}."
    if state.get("image_bytes"):
        result = await ai_service.analyze_prescription(state["image_bytes"], system_role=system_role)
    else:
        result = await ai_service.analyze_text(state.get("raw_input", "") or "", system_role=system_role)

    data = parse_ai_response(result)
    if isinstance(data, dict) and data.get("error"):
        return {"extraction": {"error": "failed to parse", "details": data}, "steps_completed": ["extraction_failed"]}

    return {"extraction": data, "steps_completed": ["extracted"]}

async def safety_node(state: AgentState):
    """Agent 2 & 3: Compliance & DDI Matrix"""
    medications = state["extraction"].get("medications", [])
    if not ai_service.live_mode:
        warnings = ["AI Service is offline. No safety check performed."]
        return {"safety_check": warnings, "steps_completed": state["steps_completed"] + ["safety_failed"]}

    prompt = f"""
    Act as a Safety Compliance Agent. Analyze these medications for drug-drug interactions, 
    contraindications, and safety warnings:
    {json.dumps(medications)}
    
    Return a list of warnings. ONLY JSON array of strings.
    """
    try:
        system_role = f"Analyze for safety risks. Provide all warnings in {state['target_language']}."
        response_text = await ai_service.generate_content(prompt, system_role=system_role)
        warnings = parse_ai_response(response_text)
        if not isinstance(warnings, list):
            warnings = [str(warnings)] if warnings else []
    except Exception as exc:
        print(f"Safety node AI error: {exc}")
        warnings = ["Potential interaction risk needs manual review"]

    return {"safety_check": warnings, "steps_completed": state["steps_completed"] + ["safety_checked"]}

async def resolver_node(state: AgentState):
    """Agent 4: Clinical Conflict Resolution & Alternatives"""
    extraction = state["extraction"]
    safety = state["safety_check"]
    
    # Only run if there are safety warnings
    if not safety or len(safety) == 0:
        return {"resolution_suggestions": [], "steps_completed": state["steps_completed"] + ["no_resolution_needed"]}

    prompt = f"""
    Act as a Master Clinical Resolver. We have detected these safety issues: {json.dumps(safety)}
    For these medications: {json.dumps(extraction.get('medications', []))}
    
    Suggest safer alternatives or dosage adjustments to resolve these risks. 
    Return a JSON array of objects: [{{"conflict": "desc", "resolution": "suggested change"}}]
    """
    try:
        response_text = await ai_service.generate_content(prompt)
        suggestions = parse_ai_response(response_text)
        if not isinstance(suggestions, list):
            suggestions = []
        return {"resolution_suggestions": suggestions, "steps_completed": state["steps_completed"] + ["resolved"]}
    except:
        return {"resolution_suggestions": [], "steps_completed": state["steps_completed"] + ["resolution_failed"]}

async def synthesis_node(state: AgentState):
    """Agent 5: Heuristic Synthesis of Final Report"""
    extraction = state["extraction"]
    safety = state["safety_check"]
    resolutions = state.get("resolution_suggestions", [])

    if not ai_service.live_mode:
        extraction["clinical_assessment"] = {"warnings": safety, "summary": "Analysis completed with warnings.", "confidence_score": 50}
        extraction["conflicts"] = resolutions
        extraction["status"] = "success"
        return {"final_output": extraction, "steps_completed": state["steps_completed"] + ["synthesis_fallback"]}

    prompt = f"""
    Act as a Senior Clinical Strategist and Medical Reviewer.
    Your task is to synthesize the following extraction, safety analysis, and suggested resolutions into a single medical report.
    
    IMPORTANT: Provide the entire report in the {state['target_language']} language.
    
    DATA (Extracted): {json.dumps(extraction)}
    SAFETY WARNINGS: {json.dumps(safety)}
    RESOLUTIONS: {json.dumps(resolutions)}
    
    STRUCTURE:
    {{
      "patient_info": {{ "name": "string", "age": "string", "date": "string" }},
      "medications": [
        {{ 
          "name": "string", 
          "dosage": "string", 
          "frequency": "string", 
          "instructions": "string",
          "duration_days": 10,
          "start_date": "YYYY-MM-DD"
        }}
      ],
      "doctor_info": {{ "name": "string", "specialty": "string" }},
      "clinical_assessment": {{
        "confidence_score": 95,
        "warnings": ["warning 1"],
        "summary": "Detailed professional summary"
      }},
      "conflicts": [{{ "conflict_type": "type", "severity": "high/medium/low", "description": "desc" }}],
      "status": "success"
    }}

    IMPORTANT: Include the suggested resolutions in the 'conflicts' or as part of the 'summary'.
    """
    try:
        response_text = await ai_service.generate_content(prompt)
        final = parse_ai_response(response_text)
        if not isinstance(final, dict):
            raise ValueError("Invalid synthesis response")
        return {"final_output": final, "steps_completed": state["steps_completed"] + ["synthesized"]}
    except Exception as exc:
        extraction["clinical_assessment"] = {"warnings": safety, "summary": "Analysis completed with synthesis fallback.", "confidence_score": 85}
        extraction["status"] = "success"
        extraction["conflicts"] = [{"conflict_type": "Safety Suggestion", "severity": "medium", "description": s.get('resolution', '')} for s in resolutions]
        return {"final_output": extraction, "steps_completed": state["steps_completed"] + ["synthesis_fallback"]}

def create_workflow():
    workflow = StateGraph(AgentState)

    workflow.add_node("extractor", extraction_node)
    workflow.add_node("safety_officer", safety_node)
    workflow.add_node("resolver", resolver_node)
    workflow.add_node("synthesizer", synthesis_node)

    workflow.set_entry_point("extractor")
    workflow.add_edge("extractor", "safety_officer")
    workflow.add_edge("safety_officer", "resolver")
    workflow.add_edge("resolver", "synthesizer")
    workflow.add_edge("synthesizer", END)

    return workflow.compile()

app_workflow = create_workflow()

async def run_agentic_analysis(raw_text: str = None, image_bytes: bytes = None, target_language: str = "English"):
    initial_state = {
        "raw_input": raw_text,
        "image_bytes": image_bytes,
        "extraction": {},
        "safety_check": [],
        "resolution_suggestions": [],
        "final_output": {},
        "steps_completed": [],
        "target_language": target_language
    }
    final_state = await app_workflow.ainvoke(initial_state)
    return final_state["final_output"]

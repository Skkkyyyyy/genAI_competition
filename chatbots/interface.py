from little_logical_matthew import LittleLogicalMatthew
from simulation_manager import SimulationManager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
import uvicorn
import logging
import traceback
from typing import List, Optional
from supa import insert_majors, search_majors
load_dotenv()


logging.basicConfig(level=logging.DEBUG)
app = FastAPI()
llm = LittleLogicalMatthew()
sim_manager = SimulationManager()

app.add_middleware(
   CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str

class MajorIn(BaseModel):
    major_name: str
    degree_type: Optional[str] = None
    keywords: Optional[List[str]] = None

class QueryPayload(BaseModel):
    action: str               # "insert" | "search"
    majors: Optional[List[MajorIn]] = None
    search_text: Optional[str] = None

@app.post("/ai/majors")
async def ai_majors(payload: QueryPayload):
    if payload.action == "insert" and payload.majors:
        resp = insert_majors(payload.majors)
        return {"ok": True, "inserted": len(payload.majors)}
    if payload.action == "search":
        resp = search_majors(payload.search_text)
        # Normalize the supabase response to a plain list of rows
        rows = None
        try:
            # supabase-py returns an object with .data
            rows = getattr(resp, 'data', None)
        except Exception:
            rows = None
        if rows is None:
            # maybe it's already a dict/array
            try:
                if isinstance(resp, dict) and 'data' in resp:
                    rows = resp.get('data')
                else:
                    rows = resp
            except Exception:
                rows = resp

        # Ensure rows is a list
        if rows is None:
            rows = []

        # Map rows to the requested shape: { category: major_name, description }
        mapped = []
        for r in rows:
            try:
                # r may be a dict-like or object; convert safely
                row = r if isinstance(r, dict) else (r.__dict__ if hasattr(r, '__dict__') else dict(r))
            except Exception:
                row = {}
            category = row.get('major_name') or row.get('major') or None
            description = row.get('description') or row.get('degree_type') or None
            # if keywords exist, join them into a short description if description missing
            if not description and row.get('keywords'):
                try:
                    description = ', '.join(row.get('keywords') or [])
                except Exception:
                    description = str(row.get('keywords'))
            mapped.append({ 'category': category, 'description': description })

        return {"ok": True, "results": mapped}
    return {"ok": False, "msg": "unknown action"}

@app.post("/llm/chat")
async def chat(request: Request, payload: ChatRequest):
    try:
        client_host = request.client.host if request.client else "unknown"
        logging.debug("Incoming /llm/chat from %s payload=%s", client_host, payload)
        # If analyse_response is synchronous it's fine; wrap it to catch exceptions
        result = {"response":llm.analyse_response(payload.prompt)}
        logging.debug("LLM result: %s", result)
        return result
    except Exception as e:
        logging.error("Error in /llm/chat: %s\n%s", e, traceback.format_exc())
        return {"error": "internal_server_error", "detail": str(e)}



@app.post("/sim/start_sim")
async def act(request: Request, payload: ChatRequest):
    try:
        client_host = request.client.host if request.client else "unknown"
        logging.debug("Incoming /sim/action from %s payload=%s", client_host, payload)
        # If analyse_response is synchronous it's fine; wrap it to catch exceptions
        result = {"response": sim_manager.start_sim(payload.prompt)}
        logging.debug("LLM result: %s", result)
        return result
    except Exception as e:
        logging.error("Error in /llm/chat: %s\n%s", e, traceback.format_exc())
        return {"error": "internal_server_error", "detail": str(e)}

@app.post("/sim/action")
async def act(request: Request, payload: ChatRequest):
    try:
        client_host = request.client.host if request.client else "unknown"
        logging.debug("Incoming /sim/action from %s payload=%s", client_host, payload)
        # If analyse_response is synchronous it's fine; wrap it to catch exceptions
        result = {"response": sim_manager.user_response(payload.prompt)}
        logging.debug("LLM result: %s", result)
        return result
    except Exception as e:
        logging.error("Error in /llm/chat: %s\n%s", e, traceback.format_exc())
        return {"error": "internal_server_error", "detail": str(e)}

if __name__ == "__main__":
    # Use 0.0.0.0 so devices/emulators can reach this machine. Use port 8000 to match your client.
    print("🚀 Starting FastAPI server on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
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
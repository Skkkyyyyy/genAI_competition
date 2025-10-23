from chatbots.little_logical_matthew import LittleLogicalMatthew as llm
from chatbots.simulation_manager import SimulationManager as sim_manager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

app = FastAPI()
API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

@app.post("/llm/chat")
async def chat(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    return llm.call_chatbot(prompt)


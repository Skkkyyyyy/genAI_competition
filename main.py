from fastapi import FastAPI, Request
import requests 
import os 
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    prompt = data.get("prompt","")

    headers = {
        "content-type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
        "HTTP-Referer": "http://localhost:3000",
    }
    payload = {
        "model": "openai/gpt-4o",
        "messages": [{"role": "user", "content": prompt}],
    }

    response = requests.post(BASE_URL, headers=headers, json=payload)
    return response.json()


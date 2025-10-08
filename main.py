from fastapi import FastAPI, Request
import requests 
import os 
from dotenv import load_dotenv

from LogicalLittleMatthew.little_logical_matthew import LittleLogicalMatthew

load_dotenv()

app = FastAPI()
API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

LLM = LittleLogicalMatthew()

@app.post("/greet")
async def greet(request: Request):
    return LLM.initiate_convo() ##Returns a tuple with two strings, a greeting and a follow up question

@app.post("/chat")
async def chat(request: Request):
    data = await request.json() #json -> python dict
    prompt = data.get("prompt","") #extract the prompt field
    response = LLM.call_chatbot(f'{prompt}')

    # headers = {
    #     "content-type": "application/json",
    #     "Authorization": f"Bearer {API_KEY}",
    #     "HTTP-Referer": "http://localhost:3000",
    # }
    # payload = {
    #     "model": "openai/gpt-4o",
    #     "messages": [{"role": "user", "content": prompt}],
    # }
    #
    # response = requests.post(BASE_URL, headers=headers, json=payload)
    return response.json()


from chatbots.little_logical_matthew import LittleLogicalMatthew
from chatbots.simulation_manager import SimulationManager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
import uvicorn

#app = FastAPI()
#llm = LittleLogicalMatthew()

#app.add_middleware(
   # CORSMiddleware,
    #allow_origins=["*"],
    #allow_credentials=True,
    #allow_methods=["*"],
    #allow_headers=["*"],
#)

#class ChatRequest(BaseModel):
 #   prompt: str
###
#@app.post("/llm/chat")
#async def chat(request: ChatRequest):
   # return llm.analyse_response(request.prompt)

#@app.get("/")
#async def root():
 #   return {"message": "FastAPI server is running!"}

#@app.get("/health")
#async def health():
 #   return {"status": "healthy"}

#if __name__ == "__main__":
  #  print("🚀 Starting FastAPI server on http://127.0.0.1:8000")
  #  print("📝 Test with: python test_client.py")
 #   uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
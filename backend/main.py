# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MURF_API_KEY = os.getenv("MURF_API_KEY")
if not MURF_API_KEY:
    raise Exception("MURF_API_KEY not set in environment")

app = FastAPI()

# Allow frontend URLs
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TTSRequest(BaseModel):
    voiceId: str
    text: str
    style: str = "Conversational"
    format: str = "mp3"


@app.get("/")
async def root():
    return {"message": "🚀 FastAPI server is running!"}


@app.post("/api/tts")
async def generate_tts(req: TTSRequest):
    url = "https://api.murf.ai/v1/speech/generate"
    headers = {
        "api-key": MURF_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "voiceId": req.voiceId,
        "text": req.text,
        "style": req.style,
        "format": req.format
    }

    response = requests.post(url, headers=headers, json=payload)

    print("===== Murf Request =====")
    print(payload)
    print("===== Murf Status =====", response.status_code)
    print("===== Murf Response =====", response.text)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    data = response.json()

    # ✅ Use 'audioFile' instead of 'audioUrl'
    if "audioFile" not in data:
        raise HTTPException(status_code=500, detail=f"Murf API did not return audioFile: {data}")

    return {"audioUrl": data["audioFile"]}  # frontend can use this URL directly

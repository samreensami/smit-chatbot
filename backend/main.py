import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # Added for frontend hosting
from pydantic import BaseModel
from typing import Optional

from services.faq_checker import check_local_first
from services.gemini_service import get_gemini_response, get_fallback_response

app = FastAPI(
    title="SMIT Chatbot API",
    description="FAQ Agent for Saylani Mass IT Training",
    version="1.0.0"
)

# --- CRITICAL: CORS UPDATE ---
# Allow localhost for dev and '*' or specific HF domains for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, HF Spaces often use unique subdomains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    source: str 

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": "Hugging Face Spaces"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    message = request.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Step 1: Local FAQ
    local_answer = check_local_first(message)
    if local_answer:
        return ChatResponse(reply=local_answer, source="local")

    # Step 2: Gemini AI Fallback
    try:
        ai_response = get_gemini_response(message)
        return ChatResponse(reply=ai_response, source="ai")
    except Exception as e:
        # Log error in HF logs
        print(f"HF Deployment Error: {e}") 
        return ChatResponse(reply=get_fallback_response(), source="fallback")

# --- NEW: Serve Frontend Static Files ---
# This assumes your Dockerfile copies the 'out' folder from Next.js build
frontend_path = os.path.join(os.path.dirname(__file__), "../frontend/out")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    # HF looks for port 7860 by default
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
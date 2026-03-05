"""
SMIT Chatbot - FastAPI Backend
FAQ Agent with local matching + Gemini AI fallback
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from services.faq_checker import check_local_first
from services.gemini_service import get_gemini_response, get_fallback_response

# Initialize FastAPI app
app = FastAPI(
    title="SMIT Chatbot API",
    description="FAQ Agent for Saylani Mass IT Training",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    source: str  # "local" or "ai"


# Health check endpoint
@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "SMIT Chatbot API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Main chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint
    Logic:
    1. Check local FAQ first (saves tokens)
    2. If no local match, call Gemini AI
    """
    message = request.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Step 1: Check local FAQ first
    local_answer = check_local_first(message)

    if local_answer:
        return ChatResponse(
            reply=local_answer,
            source="local"
        )

    # Step 2: No local match - use Gemini AI
    try:
        ai_response = get_gemini_response(message)
        return ChatResponse(
            reply=ai_response,
            source="ai"
        )
    except Exception as e:
        print(f"Error getting AI response: {e}")
        return ChatResponse(
            reply=get_fallback_response(),
            source="fallback"
        )


# FAQ list endpoint (for debugging/admin)
@app.get("/api/faqs")
async def get_faqs():
    """Get all FAQs from local database"""
    import json
    import os

    faq_file = os.path.join(os.path.dirname(__file__), "faq_data.json")

    try:
        with open(faq_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            return {"faqs": data.get("faqs", []), "count": len(data.get("faqs", []))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading FAQs: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

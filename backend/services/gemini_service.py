"""
Gemini API Service
Handles AI responses when local FAQ doesn't match
"""

import os
from typing import Optional
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# System prompt for SMIT context
SYSTEM_PROMPT = """You are a helpful assistant for SMIT (Saylani Mass IT Training), a free IT education program by Saylani Welfare Trust in Pakistan.

Key information about SMIT:
- Completely FREE IT courses
- Courses: Web Development, Mobile Apps, Graphic Design, Digital Marketing, Python, AI/ML, etc.
- Duration: 3-12 months depending on course
- Locations: Multiple cities across Pakistan (Karachi, Lahore, Islamabad, etc.)
- Eligibility: Matric minimum, age 18-35
- Provides certificates upon completion
- Helps with job placement

Guidelines:
- Be friendly and professional
- Give concise, helpful answers
- If you don't know specific details, suggest visiting saylaniwelfare.com or the nearest campus
- Support both English and Roman Urdu queries
- Keep responses under 200 words unless detailed explanation is needed
"""


def configure_gemini():
    """Configure Gemini API with key"""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    genai.configure(api_key=GEMINI_API_KEY)


def get_gemini_response(query: str) -> str:
    """
    Get response from Gemini API
    Used when local FAQ doesn't have the answer
    """
    try:
        configure_gemini()

        # Create model
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=SYSTEM_PROMPT
        )

        # Generate response
        response = model.generate_content(query)

        if response and response.text:
            return response.text
        else:
            return get_fallback_response()

    except Exception as e:
        print(f"Gemini API error: {e}")
        return get_fallback_response()


def get_fallback_response() -> str:
    """Return fallback response when API fails"""
    return (
        "I apologize, but I'm having trouble processing your request right now. "
        "For accurate information about SMIT, please:\n\n"
        "• Visit: saylaniwelfare.com/smit\n"
        "• Call: 0800-786-786\n"
        "• Visit the nearest SMIT campus\n\n"
        "Is there anything specific about admissions, courses, or fees I can help with?"
    )


async def get_gemini_response_async(query: str) -> str:
    """
    Async version of get_gemini_response
    """
    # For now, just call the sync version
    # Can be made truly async if needed
    return get_gemini_response(query)

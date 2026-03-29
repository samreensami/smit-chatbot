from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
from typing import Optional
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    logger.info("Gemini API configured successfully")
else:
    logger.warning("Warning: GEMINI_API_KEY not found in environment variables")

app = FastAPI(
    title="SMIT AI Communication Assistant",
    description="AI-powered chatbot system for Saylani Mass IT Training (SMIT)",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class MessageRequest(BaseModel):
    message: str
    context: Optional[str] = None
    language: Optional[str] = "en"

class AnnouncementRequest(BaseModel):
    topic: str
    audience: Optional[str] = "students"
    language: Optional[str] = "en"

class SocialMediaRequest(BaseModel):
    topic: str
    platform: str
    language: Optional[str] = "en"

class EmailRequest(BaseModel):
    subject: str
    recipient: str
    content: str
    language: Optional[str] = "en"

class VoiceChatRequest(BaseModel):
    text: str
    language: Optional[str] = "en"

# Initialize the model if API key is available
model = None
if api_key:
    try:
        model = genai.GenerativeModel('gemini-pro')
        logger.info("Gemini model initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing Gemini model: {str(e)}")

def get_gemini_response(prompt: str) -> str:
    """Get response from Gemini API"""
    if model:
        try:
            response = model.generate_content(prompt)
            if response.text:
                return response.text
            else:
                return "I couldn't generate a response. Please try again."
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return f"I encountered an error processing your request: {str(e)}"
    else:
        # Fallback response when API key is not configured
        return "Gemini API not configured. Please set GEMINI_API_KEY in environment variables."

def format_response(content: str, response_type: str = "text") -> dict:
    """Format response with metadata"""
    return {
        "content": content,
        "timestamp": datetime.utcnow().isoformat(),
        "type": response_type,
        "source": "SMIT AI Assistant"
    }

@app.get("/")
async def root():
    return {"message": "SMIT AI Communication Assistant API", "status": "running", "version": "1.0.0"}

@app.post("/chat")
async def chat(message_request: MessageRequest):
    """Handle general chat messages"""
    logger.info(f"Received chat request: {message_request.message[:50]}...")

    # Determine language-specific instructions
    language_instructions = ""
    if message_request.language.lower() == "ur":
        language_instructions = "\nRespond in Urdu."
    elif message_request.language.lower() == "roman-ur":
        language_instructions = "\nRespond in Roman Urdu."

    prompt = f"""
    You are an AI assistant for Saylani Mass IT Training (SMIT).
    Respond professionally and helpfully to the following message:

    Message: {message_request.message}

    Context: {message_request.context or 'No specific context provided'}

    Follow SMIT branding guidelines:
    - Professional
    - Clean
    - Trustworthy
    - Friendly
    - Non-corporate
    - Use easy language
    - Maintain SMIT identity
    - Keep responses clear and accurate

    {language_instructions}
    """

    response = get_gemini_response(prompt)
    return format_response(response, "chat")

@app.post("/generate-announcement")
async def generate_announcement(announcement_request: AnnouncementRequest):
    """Generate professional announcements"""
    logger.info(f"Generating announcement for topic: {announcement_request.topic}")

    language_instructions = ""
    if announcement_request.language.lower() == "ur":
        language_instructions = "\nCreate the announcement in Urdu."
    elif announcement_request.language.lower() == "roman-ur":
        language_instructions = "\nCreate the announcement in Roman Urdu."

    prompt = f"""
    Create a professional announcement for Saylani Mass IT Training (SMIT) about:
    Topic: {announcement_request.topic}
    Audience: {announcement_request.audience}

    Follow these guidelines:
    - Keep sentences short
    - Avoid complex vocabulary
    - No slang
    - No emojis in official announcements
    - Professional and clear
    - Maintain SMIT identity
    - Use simple and understandable language
    - Include appropriate greeting and closing

    Format the announcement appropriately for the audience.

    {language_instructions}
    """

    response = get_gemini_response(prompt)
    return format_response(response, "announcement")

@app.post("/generate-social-media-post")
async def generate_social_media_post(social_media_request: SocialMediaRequest):
    """Generate social media posts"""
    logger.info(f"Generating social media post for {social_media_request.platform}: {social_media_request.topic}")

    language_instructions = ""
    if social_media_request.language.lower() == "ur":
        language_instructions = "\nCreate the post in Urdu."
    elif social_media_request.language.lower() == "roman-ur":
        language_instructions = "\nCreate the post in Roman Urdu."

    prompt = f"""
    Create a social media post for {social_media_request.platform} about:
    Topic: {social_media_request.topic}

    Include:
    - Engaging caption
    - 3-5 relevant hashtags
    - Appropriate emojis (only when suitable)
    - Suggestion for image/video content

    Guidelines:
    - Keep sentences short
    - Friendly and engaging tone
    - Use simple and understandable language
    - Maintain SMIT identity
    - Professional but approachable
    - Suitable for {social_media_request.platform} audience

    {language_instructions}
    """

    response = get_gemini_response(prompt)
    return format_response(response, "social_media")

@app.post("/generate-email")
async def generate_email(email_request: EmailRequest):
    """Generate emails"""
    logger.info(f"Generating email for {email_request.recipient}: {email_request.subject}")

    language_instructions = ""
    if email_request.language.lower() == "ur":
        language_instructions = "\nWrite the email in Urdu."
    elif email_request.language.lower() == "roman-ur":
        language_instructions = "\nWrite the email in Roman Urdu."

    prompt = f"""
    Write a professional email for Saylani Mass IT Training (SMIT):
    Subject: {email_request.subject}
    Recipient: {email_request.recipient}
    Content: {email_request.content}

    Include:
    - Appropriate greeting
    - Clear body with requested content
    - Professional closing
    - Proper email structure

    Guidelines:
    - Appropriate tone (formal/semi-formal as needed)
    - Clear and professional
    - Maintain SMIT identity
    - Use simple and understandable language
    - Proper email etiquette

    {language_instructions}
    """

    response = get_gemini_response(prompt)
    return format_response(response, "email")

@app.post("/voice-chat")
async def voice_chat_endpoint(text: str = Form(...), language: str = Form("en")):
    """Handle voice chat functionality with text-to-speech"""
    logger.info(f"Processing voice chat request in {language}")

    # Process the text with Gemini to generate a response
    language_instructions = ""
    if language.lower() == "ur":
        language_instructions = "\nRespond in Urdu."
    elif language.lower() == "roman-ur":
        language_instructions = "\nRespond in Roman Urdu."

    prompt = f"""
    You are an AI assistant for Saylani Mass IT Training (SMIT).
    Respond professionally and helpfully to the following message:

    Message: {text}

    Follow SMIT branding guidelines:
    - Professional
    - Clean
    - Trustworthy
    - Friendly
    - Non-corporate
    - Use easy language
    - Maintain SMIT identity
    - Keep responses clear and accurate
    - Keep responses concise for voice delivery

    {language_instructions}
    """

    response = get_gemini_response(prompt)

    return {
        "text": text,
        "response": response,
        "language": language,
        "timestamp": datetime.utcnow().isoformat(),
        "type": "voice_response"
    }


@app.post("/process-audio")
async def process_audio(audio_file: UploadFile = File(...)):
    """Process uploaded audio file and return text transcription"""
    logger.info(f"Processing audio file: {audio_file.filename}")

    try:
        # Save the uploaded file temporarily
        import tempfile
        import os

        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            # Write the uploaded content to the temp file
            content = await audio_file.read()
            temp_file.write(content)
            temp_filename = temp_file.name

        try:
            # Use speech recognition to convert audio to text
            import speech_recognition as sr

            recognizer = sr.Recognizer()

            # Load the audio file
            with sr.AudioFile(temp_filename) as source:
                audio_data = recognizer.record(source)

            # Recognize the speech
            # For English
            text = recognizer.recognize_google(audio_data, language='en-US')

            # Process the recognized text with Gemini
            language_instructions = ""
            prompt = f"""
            You are an AI assistant for Saylani Mass IT Training (SMIT).
            Respond professionally and helpfully to the following message:

            Message: {text}

            Follow SMIT branding guidelines:
            - Professional
            - Clean
            - Trustworthy
            - Friendly
            - Non-corporate
            - Use easy language
            - Maintain SMIT identity
            - Keep responses clear and accurate
            - Keep responses concise for voice delivery

            {language_instructions}
            """

            response = get_gemini_response(prompt)

            return {
                "transcription": text,
                "response": response,
                "language": "en",
                "timestamp": datetime.utcnow().isoformat(),
                "type": "voice_processing_result"
            }

        finally:
            # Clean up the temporary file
            os.unlink(temp_filename)

    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing audio file: {str(e)}")

@app.post("/faq")
async def faq(message_request: MessageRequest):
    """Handle FAQ and support queries"""
    logger.info(f"Received FAQ request: {message_request.message[:50]}...")

    language_instructions = ""
    if message_request.language.lower() == "ur":
        language_instructions = "\nRespond in Urdu."
    elif message_request.language.lower() == "roman-ur":
        language_instructions = "\nRespond in Roman Urdu."

    prompt = f"""
    You are an AI assistant for Saylani Mass IT Training (SMIT) handling FAQ and support queries.
    Answer the following question based on typical educational institution information:

    Question: {message_request.message}

    Context: {message_request.context or 'General FAQ and support'}

    Guidelines:
    - Provide accurate and helpful information
    - If you don't know the specific answer, suggest contacting SMIT administration
    - Keep responses concise but informative
    - Maintain SMIT identity
    - Professional and friendly tone
    - Use simple and understandable language

    Common topics include:
    - Admissions and enrollment
    - Course information and schedules
    - Fees and payment
    - Certifications
    - Attendance policies
    - Contact information

    {language_instructions}
    """

    response = get_gemini_response(prompt)
    return format_response(response, "faq")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "SMIT AI Communication Assistant",
        "timestamp": datetime.utcnow().isoformat(),
        "api_configured": bool(model is not None)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
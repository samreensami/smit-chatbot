# SMIT AI Communication Assistant

An AI-powered chatbot system for Saylani Mass IT Training (SMIT) built with Next.js and FastAPI.

## Features

- **Chat Interface**: Interactive chat with SMIT Assistant
- **Announcement Generator**: Create professional announcements
- **Social Media Post Generator**: Generate content for Facebook, Instagram, LinkedIn
- **Email Generator**: Draft formal emails for students and staff
- **FAQ & Support Bot**: Answer common questions about courses, admissions, etc.
- **Multi-language Support**: English, Urdu, and Roman Urdu
- **Voice Chatbot**: Voice input and output capabilities

## Architecture

- **Frontend**: Next.js with Tailwind CSS
- **Backend**: Python FastAPI
- **LLM**: Google Gemini API
- **Voice Processing**: Web Speech API (browser-based)

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.8+
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Create .env file in the backend directory
GEMINI_API_KEY=your_google_gemini_api_key_here
```

5. Run the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

### Quick Start with Concurrent Execution

From the project root directory, run both servers simultaneously:

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

## Usage

1. Start both the backend and frontend servers
2. Open your browser to `http://localhost:3000`
3. Select the desired feature tab (Chat, Announcements, Social Media, Emails, Support)
4. Enter your query or topic
5. Choose the preferred language
6. Submit to get AI-generated responses

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /chat` - General chat functionality
- `POST /generate-announcement` - Generate announcements
- `POST /generate-social-media-post` - Generate social media content
- `POST /generate-email` - Generate emails
- `POST /faq` - FAQ and support queries
- `POST /voice-chat` - Handle voice chat
- `POST /process-audio` - Process uploaded audio files

## SMIT Branding Guidelines

- **Colors**: Blue (#1E90FF), Green (#32CD32), White (#FFFFFF), Accent Blue (#0F52BA), Accent Green (#228B22)
- **Tone**: Professional, clean, trustworthy, friendly, non-corporate
- **Language**: Simple and understandable
- **No flashy colors**, keep UI simple and readable

## Development

For development, run both servers in separate terminals:

Backend:
```bash
cd backend
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm run dev
```

Or use the concurrent script:
```bash
npm run dev
```

## Testing

Run the test script to verify all features:
```bash
python test_features.py
```

## Deployment

See `DEPLOYMENT.md` for detailed production deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is created for Saylani Mass IT Training (SMIT).
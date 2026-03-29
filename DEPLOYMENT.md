# SMIT AI Communication Assistant - Deployment Guide

## Overview
This guide provides instructions for deploying the SMIT AI Communication Assistant application to production.

## Prerequisites
- Node.js 18+ for frontend
- Python 3.8+ for backend
- Google Gemini API key
- Server with HTTPS support (recommended)

## Environment Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Frontend Environment Variables
The frontend communicates with the backend via API calls. Update the API endpoints if needed in the frontend code.

## Production Deployment

### Option 1: Separate Deployment (Recommended)

#### Backend Deployment
1. Deploy the FastAPI backend to a cloud platform (Heroku, AWS, Google Cloud, etc.)
2. Ensure the server is accessible via HTTPS
3. Update the frontend to point to the production backend URL

#### Frontend Deployment
1. Build the Next.js application:
```bash
cd frontend
npm run build
```

2. Deploy the built application to a static hosting service (Vercel, Netlify, etc.)

### Option 2: Docker Deployment

Create a `Dockerfile` for the backend:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/. .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create a `Dockerfile` for the frontend:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/. .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
```

Create a `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./backend:/app

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - BACKEND_URL=http://backend:8000
```

## Configuration for Production

### CORS Settings
Update the backend CORS settings in `main.py` for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Replace with your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### SSL/TLS
Ensure both frontend and backend are served over HTTPS in production.

## Monitoring and Logging

The application includes basic logging. For production, consider implementing:

- Centralized logging (ELK stack, etc.)
- Application monitoring (New Relic, DataDog, etc.)
- Error tracking (Sentry, etc.)

## Security Considerations

- Use HTTPS for all communications
- Validate and sanitize all inputs
- Implement rate limiting
- Secure the API key storage
- Regular security audits

## Scaling Recommendations

- Use a load balancer for multiple backend instances
- Implement caching for frequently accessed data
- Use a CDN for frontend assets
- Monitor resource usage and scale accordingly

## Troubleshooting

### Common Issues
1. **CORS errors**: Check CORS settings in backend
2. **API key not working**: Verify the GEMINI_API_KEY is set correctly
3. **Voice features not working**: Check browser compatibility and permissions

### Logs
Check backend logs for errors:
```bash
# If running with uvicorn
uvicorn main:app --reload --log-level info
```

## Maintenance

### Updates
1. Update dependencies regularly
2. Monitor for security vulnerabilities
3. Backup configurations and data regularly

### Performance
- Monitor response times
- Optimize database queries if applicable
- Scale resources based on usage

## Support

For technical support:
- Check the logs for error messages
- Verify all environment variables are set
- Ensure network connectivity between frontend and backend
- Contact the development team for complex issues

---

© 2026 Saylani Mass IT Training (SMIT). All rights reserved.
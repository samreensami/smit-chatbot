# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend & Final Image
FROM python:3.9-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files
COPY . .

# Copy built frontend from Stage 1 (if serving via FastAPI)
COPY --from=frontend-builder /app/frontend/out ./frontend/out

# Hugging Face runs on port 7860 by default
ENV PORT=7860
EXPOSE 7860

# Start FastAPI (using uvicorn)
# Make sure your main.py is in the backend folder
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
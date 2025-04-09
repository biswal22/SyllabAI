# This is a wrapper Dockerfile that points to the backend Dockerfile
# It's needed because Railway might be looking for the Dockerfile at the repository root

FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend directory
COPY backend/ .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

# Expose the port
EXPOSE ${PORT}

# Run command
CMD gunicorn --bind 0.0.0.0:${PORT} --timeout 120 app:app 
# This is a wrapper Dockerfile that points to the backend Dockerfile
# It's needed because Railway might be looking for the Dockerfile at the repository root

FROM python:3.9-slim

# Install essential system dependencies including Tesseract OCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set up the working directory
WORKDIR /app

# Copy all backend files
COPY backend/ .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expose the port
EXPOSE ${PORT}

# Run the application
CMD gunicorn --bind 0.0.0.0:${PORT} --timeout 180 app:app 
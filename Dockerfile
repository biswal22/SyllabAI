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

# Try to copy from backend directory if it exists, otherwise assume we're already in the backend directory
COPY . /app/
# Check if requirements.txt exists in the current directory
RUN if [ -f requirements.txt ]; then \
        echo "Found requirements.txt in root directory"; \
    elif [ -f backend/requirements.txt ]; then \
        echo "Found requirements.txt in backend/ directory"; \
        cp backend/requirements.txt .; \
    else \
        echo "No requirements.txt found!"; \
        exit 1; \
    fi

# Install Python dependencies
# Pin the openai version to 1.1.1 to avoid compatibility issues
RUN pip install --no-cache-dir openai==1.1.1
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expose the port
EXPOSE ${PORT}

# Run command
CMD gunicorn --bind 0.0.0.0:${PORT} --timeout 120 app:app 
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python libraries for Agents
RUN pip install --no-cache-dir \
    pymupdf \
    requests \
    pandas \
    numpy \
    scikit-learn \
    sentence-transformers \
    groq \
    oumi

# Set working directory
WORKDIR /app

# The worker will mount the agents directory here
CMD ["python3", "--version"]

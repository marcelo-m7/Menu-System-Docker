# Stage 1: Build Stage
FROM python:3.9-slim as builder

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production Stage
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy installed dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Copy the application code
COPY app/ app/

# Expose the port Flask runs on
EXPOSE 5000

# Run the Flask application
CMD ["flask", "run", "--host", "0.0.0.0"]
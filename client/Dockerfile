FROM node:18-alpine

WORKDIR /app

# Install dependencies first (including dev dependencies)
COPY package*.json ./
RUN npm ci && \
    npm install -g vite @vitejs/plugin-react

# Copy the rest of the application
COPY . .

# Make sure the port is exposed
EXPOSE 5173

# Set host to 0.0.0.0 to allow external connections
ENV HOST=0.0.0.0

# Start the application
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0"]

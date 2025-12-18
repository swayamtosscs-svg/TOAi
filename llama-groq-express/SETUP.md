# Quick Setup Guide

## 1. Create .env file

Create a `.env` file in the `llama-groq-express` directory with the following content:

```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
MODEL_NAME=llama-3.3-70b-versatile
PLUGIN_ENABLED=true
```

**Important:** Replace `your_groq_api_key_here` with your actual Groq API key.

## 2. Start the Server

From the project root directory:

```bash
# Development mode (with auto-reload)
npm run server:dev

# Production mode
npm run server:start
```

## 3. Test the API

Once the server is running, you can test it:

```bash
# Health check
curl http://localhost:5000/api/chat/health

# Check plugin status
curl http://localhost:5000/api/chat/status

# Send a chat message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

## Plugin Activation/Deactivation

To disable the plugin, set `PLUGIN_ENABLED=false` in your `.env` file and restart the server.

When disabled, the API will return a 503 status indicating the plugin is not available.


# LLaMA Groq Express Backend

Backend API server for TOAI chat application using Groq's LLaMA 3.3 model.

## Features

- 🤖 LLaMA 3.3 70B Versatile model integration via Groq
- 🔌 Plugin-based architecture (can be activated/deactivated)
- 🚀 Express.js REST API
- 🔒 Environment-based configuration
- 📝 Conversation history support

## Setup

1. Install dependencies (from project root):
```bash
npm install
```

2. Configure environment variables:
```bash
cd llama-groq-express
cp .env.example .env
```

3. Edit `.env` file and add your Groq API key:
```
PORT=5000
GROQ_API_KEY=your_actual_groq_api_key_here
MODEL_NAME=llama-3.3-70b-versatile
PLUGIN_ENABLED=true
```

## Running the Server

From the project root:
```bash
npm run server:dev    # Development mode with nodemon
npm run server:start  # Production mode
```

Or from the `llama-groq-express` directory:
```bash
node src/server.js
```

## API Endpoints

### Health Check
```
GET /api/chat/health
```

### Plugin Status
```
GET /api/chat/status
```

### Send Chat Message
```
POST /api/chat
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

## Plugin Activation

The plugin can be activated/deactivated via the `PLUGIN_ENABLED` environment variable:

- `PLUGIN_ENABLED=true` - Plugin is active (default)
- `PLUGIN_ENABLED=false` - Plugin is disabled

When disabled, the API will return a 503 status with an error message.

## Project Structure

```
llama-groq-express/
├── src/
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   ├── config/
│   │   └── env.js             # Environment variables
│   ├── clients/
│   │   └── groqClient.js      # Groq SDK initialization
│   ├── services/
│   │   └── llamaService.js    # LLaMA 3.3 logic
│   ├── routes/
│   │   └── chat.routes.js     # API routes
│   └── controllers/
│       └── chat.controller.js # Request/response logic
├── .env                        # Environment variables
└── README.md
```


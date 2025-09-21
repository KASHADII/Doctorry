# AI Chatbot Integration Guide

## Overview
Your AI-powered chatbot has been successfully integrated into the Doctorry project! The chatbot uses the Groq API with the Llama 3.1 8B model to provide medical assistance.

## What's Been Added

### Backend Integration
1. **New Route**: `/api/chatbot/chat` - Handles chat interactions
2. **New Route**: `/api/chatbot/health` - Health check for chatbot service
3. **Dependencies**: Added `axios` for HTTP requests to Groq API
4. **System Prompt**: Created `server/system_prompt.txt` with medical assistant instructions

### Frontend Integration
1. **Chatbot Component**: `client/src/components/Chatbot.jsx` - Modern, responsive chat interface
2. **Global Access**: Chatbot is available on all pages as a floating widget
3. **Features**:
   - Minimizable/maximizable interface
   - Real-time messaging
   - Chat history
   - Clear chat functionality
   - Loading states
   - Medical disclaimer

## Setup Instructions

### 1. Environment Variables
Add your Groq API key to your server environment:

```bash
# In your server/.env file
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Get Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up/Login to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

### 3. Install Dependencies
The required dependencies have been installed:
- `axios` (for HTTP requests)

### 4. Start the Application
```bash
# Start the server
cd server
npm start

# Start the client (in another terminal)
cd client
npm run dev
```

## Features

### Chatbot Interface
- **Floating Widget**: Always accessible on any page
- **Minimizable**: Click header to minimize/maximize
- **Responsive**: Works on desktop and mobile
- **Modern UI**: Clean, professional design matching your app theme

### Medical Assistant Capabilities
- General health information
- Symptom explanations
- Wellness advice
- Medication information
- Medical terminology help
- Emergency guidance (directs to seek professional help)

### Safety Features
- Medical disclaimer on every interaction
- Encourages professional consultation
- No specific medical diagnoses
- Emergency symptom detection

## API Endpoints

### POST `/api/chatbot/chat`
Send a message to the chatbot.

**Request Body:**
```json
{
  "message": "What are the symptoms of flu?",
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant", 
      "content": "Hello! How can I help you today?"
    }
  ]
}
```

**Response:**
```json
{
  "reply": "Flu symptoms typically include fever, cough, sore throat, body aches, and fatigue...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET `/api/chatbot/health`
Check chatbot service status.

**Response:**
```json
{
  "status": "Chatbot service is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "hasApiKey": true,
  "hasSystemPrompt": true
}
```

## Customization

### System Prompt
Edit `server/system_prompt.txt` to customize the chatbot's behavior and responses.

### UI Styling
The chatbot component uses Tailwind CSS classes. You can modify the styling in `client/src/components/Chatbot.jsx`.

### Model Configuration
To use a different Groq model, modify the `model` parameter in `server/routes/chatbot.js`:
```javascript
model: 'llama-3.1-8b-instant' // Change to your preferred model
```

## Testing

### 1. Health Check
Visit `http://localhost:5000/api/chatbot/health` to verify the service is running.

### 2. Chat Interface
1. Start your application
2. Look for the floating chatbot widget in the bottom-right corner
3. Click to open and test the conversation

### 3. Sample Questions
Try asking:
- "What are the symptoms of diabetes?"
- "How can I prevent heart disease?"
- "What should I do if I have chest pain?"
- "Explain what hypertension means"

## Troubleshooting

### Common Issues

1. **"API Call Error"**
   - Check if GROQ_API_KEY is set correctly
   - Verify your Groq API key is valid
   - Check internet connection

2. **"System prompt not found"**
   - Ensure `server/system_prompt.txt` exists
   - Check file permissions

3. **Chatbot not appearing**
   - Check browser console for errors
   - Verify React component is imported correctly
   - Check if server is running

### Debug Steps
1. Check server logs for errors
2. Verify environment variables
3. Test API endpoints directly
4. Check browser developer tools

## Security Notes

- The chatbot provides general health information only
- Always includes medical disclaimers
- Encourages professional medical consultation
- Never provides specific diagnoses or treatments
- Emergency symptoms trigger immediate professional consultation advice

## Next Steps

1. **Add Authentication**: Consider requiring user login for chatbot access
2. **Chat History**: Implement persistent chat history storage
3. **Analytics**: Track chatbot usage and popular questions
4. **Multi-language**: Add support for multiple languages
5. **Voice Input**: Add speech-to-text capabilities
6. **Integration**: Connect with appointment booking system

Your AI chatbot is now fully integrated and ready to assist your users with medical information!

# Chatbot Troubleshooting Guide

## Issue: "Failed to execute 'json' on 'Response': Unexpected end of JSON input"

This error occurs when the server doesn't return valid JSON. Here are the steps to fix it:

## Step 1: Check if Server is Running

1. Open a terminal in the `server` directory
2. Run: `npm start`
3. You should see: "🚀 Server running on port 5000"

## Step 2: Set Up Environment Variables

Create a `.env` file in the `server` directory with:

```bash
# Development Environment Variables
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/doctorry

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_here

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# AI Chatbot (Groq API)
GROQ_API_KEY=your_groq_api_key_here
```

## Step 3: Get Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up/Login
3. Go to API Keys section
4. Create a new API key
5. Copy the key and replace `your_groq_api_key_here` in your `.env` file

## Step 4: Test the Endpoints

### Test Basic Server Health:
Visit: `http://localhost:5000/api/health`

### Test Chatbot Health:
Visit: `http://localhost:5000/api/chatbot/health`

### Test Chatbot Endpoint:
```bash
curl -X POST http://localhost:5000/api/chatbot/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

## Step 5: Start Both Servers

### Terminal 1 (Backend):
```bash
cd server
npm start
```

### Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

## Step 6: Test the Chatbot

1. Go to `http://localhost:5173`
2. Login to your account
3. Click the "AI Seva" button
4. Try sending a message

## Common Issues & Solutions

### Issue 1: "Server connection error"
- **Solution**: Make sure the backend server is running on port 5000

### Issue 2: "CORS error"
- **Solution**: Check that `CORS_ORIGIN=http://localhost:5173` in your `.env` file

### Issue 3: "API Call Error"
- **Solution**: Verify your Groq API key is correct and has credits

### Issue 4: "MongoDB connection error"
- **Solution**: Make sure MongoDB is running or use MongoDB Atlas

## Debug Mode

The chatbot route now includes console logging. Check your server terminal for:
- "Chatbot endpoint hit"
- "Request body: ..."
- "Processing message: ..."
- "Sending response: ..."

## Quick Fix for Testing

If you want to test without the Groq API, you can temporarily modify the chatbot route to return a mock response:

```javascript
// In server/routes/chatbot.js, replace the callGroqAPI call with:
const aiReply = "This is a test response. The chatbot is working!";
```

## Still Having Issues?

1. Check browser developer tools (F12) for network errors
2. Check server terminal for error messages
3. Verify all environment variables are set correctly
4. Make sure both servers are running on the correct ports

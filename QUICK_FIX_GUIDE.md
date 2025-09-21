# Quick Fix for Chatbot 404 Error

## The Problem
The frontend was trying to make API calls to `http://localhost:5173/api/chatbot/chat` (frontend port) instead of `http://localhost:5000/api/chatbot/chat` (backend port).

## The Solution
I've updated the ChatbotPage component to use the correct API URL. Now you need to:

### 1. Create Environment File
Create a `.env.local` file in the `client` directory:

```bash
# Copy from env.local.example
cp env.local.example .env.local
```

Or manually create `.env.local` with:
```bash
VITE_API_URL=http://localhost:5000/api
```

### 2. Start Both Servers

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### 3. Test the Chatbot
1. Go to `http://localhost:5173`
2. Login to your account
3. Click "AI Seva" button
4. Try sending a message

## What Changed
- Updated ChatbotPage.jsx to use `VITE_API_URL` environment variable
- Default fallback to `http://localhost:5000/api` if env var not set
- Better error handling for connection issues

## If Still Having Issues

### Check Backend Server
Visit: `http://localhost:5000/api/chatbot/health`

### Check Environment Variables
Make sure your `.env.local` file has:
```bash
VITE_API_URL=http://localhost:5000/api
```

### Check Server Logs
Look at your backend terminal for any error messages when you try to send a chat message.

The chatbot should now work correctly!

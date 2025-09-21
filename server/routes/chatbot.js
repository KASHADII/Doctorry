const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load environment variables
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Load the system prompt from the file
let SYSTEM_PROMPT = '';
try {
  const systemPromptPath = path.join(__dirname, '..', 'system_prompt.txt');
  SYSTEM_PROMPT = fs.readFileSync(systemPromptPath, 'utf8');
} catch (error) {
  console.error('Error loading system prompt:', error.message);
  SYSTEM_PROMPT = 'You are Daaktar AI, a helpful medical assistant. Provide accurate and helpful medical information while reminding users to consult with healthcare professionals for serious medical concerns.';
}

// Function to call the Groq API
const callGroqAPI = async (messages) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('API Call Error:', error.message);
    if (error.response) {
      console.error('Groq Response:', error.response.data);
    }
    return "Sorry, I'm having trouble connecting to the AI service. Please try again later.";
  }
};

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    console.log('Chatbot endpoint hit');
    console.log('Request body:', req.body);
    
    const { message, history = [] } = req.body;

    if (!message) {
      console.log('No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Processing message:', message);

    // Create messages for API with system prompt context
    const messagesForAPI = [
      {
        role: 'user',
        content: `Please act as a helpful assistant based on these instructions: ${SYSTEM_PROMPT}`
      },
      {
        role: 'assistant',
        content: 'Okay, I understand. I will now act as Daaktar AI based on those instructions. I am ready to begin.'
      }
    ];
    
    // Add the existing conversation history
    messagesForAPI.push(...history);
    
    // Add the new user message
    messagesForAPI.push({ role: 'user', content: message });

    // Get the AI's reply
    const aiReply = await callGroqAPI(messagesForAPI);

    // Prepare the response
    const responseData = {
      reply: aiReply,
      timestamp: new Date().toISOString()
    };

    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      reply: "Sorry, I'm experiencing technical difficulties. Please try again later."
    });
  }
});

// Health check for chatbot service
router.get('/health', (req, res) => {
  res.json({
    status: 'Chatbot service is running',
    timestamp: new Date().toISOString(),
    hasApiKey: !!GROQ_API_KEY,
    hasSystemPrompt: !!SYSTEM_PROMPT
  });
});

// Test endpoint
router.post('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({
    message: 'Test successful',
    timestamp: new Date().toISOString(),
    receivedData: req.body
  });
});

module.exports = router;

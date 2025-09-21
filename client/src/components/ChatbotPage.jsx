import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Daaktar AI, your medical assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          history: messages.slice(1).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.reply || data.error || "I'm sorry, I couldn't process your request.",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      let errorText = "Sorry, I'm having trouble connecting. Please try again later.";
      
      if (error.message.includes('Failed to execute')) {
        errorText = "Server connection error. Please check if the server is running.";
      } else if (error.message.includes('HTTP error')) {
        errorText = "Server error. Please try again later.";
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm Daaktar AI, your medical assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-white) 100%)'}}>
      {/* Enhanced Header with Gradient */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-teal) 50%, var(--color-primary-dark) 100%)',
        boxShadow: '0 8px 32px rgba(39, 97, 126, 0.3)'
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-16 h-16 rounded-full" style={{backgroundColor: 'var(--color-accent-lime)'}}></div>
          <div className="absolute top-8 right-12 w-12 h-12 rounded-full" style={{backgroundColor: 'var(--color-accent-green)'}}></div>
          <div className="absolute bottom-4 left-16 w-8 h-8 rounded-full" style={{backgroundColor: 'var(--color-white)'}}></div>
          <div className="absolute bottom-8 right-8 w-20 h-20 rounded-full" style={{backgroundColor: 'var(--color-accent-lime-light)'}}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-3 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
                style={{color: 'var(--color-white)'}}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-4">
                {/* Enhanced AI Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow" style={{
                    background: 'linear-gradient(135deg, var(--color-accent-lime) 0%, var(--color-accent-green) 100%)'
                  }}>
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white" style={{backgroundColor: 'var(--color-accent-green)'}}>
                    <div className="w-full h-full rounded-full animate-pulse" style={{backgroundColor: 'var(--color-accent-green)'}}></div>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{t('ai_seva')}</h1>
                  <p className="text-white/90 text-lg">Your Medical Assistant</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'var(--color-accent-lime)'}}></div>
                    <span className="text-white/80 text-sm">Online & Ready to Help</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={clearChat}
              className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 flex items-center space-x-3 backdrop-blur-sm border border-white/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="font-medium">Clear Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Container */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 h-[calc(100vh-280px)] flex flex-col overflow-hidden" style={{
          boxShadow: '0 25px 50px -12px rgba(39, 97, 126, 0.25)'
        }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 chat-scrollbar" style={{
            background: 'linear-gradient(180deg, var(--color-gray-50) 0%, var(--color-white) 100%)'
          }}>
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[75%] rounded-3xl px-6 py-4 shadow-lg ${
                    message.sender === 'user'
                      ? 'rounded-br-lg'
                      : 'rounded-bl-lg'
                  }`}
                  style={{
                    background: message.sender === 'user' 
                      ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-teal) 100%)'
                      : 'linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-50) 100%)',
                    color: message.sender === 'user' ? 'white' : 'var(--color-gray-800)',
                    border: message.sender === 'user' 
                      ? 'none' 
                      : '1px solid var(--color-gray-200)'
                  }}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">{message.text}</p>
                  <p className={`text-xs mt-3 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white rounded-3xl rounded-bl-lg px-6 py-4 shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full animate-typing-dots" style={{backgroundColor: 'var(--color-primary)'}}></div>
                      <div className="w-2 h-2 rounded-full animate-typing-dots" style={{backgroundColor: 'var(--color-accent-teal)', animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 rounded-full animate-typing-dots" style={{backgroundColor: 'var(--color-accent-green)', animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-gray-600 text-sm font-medium">Daaktar AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <div className="border-t border-gray-200 p-8" style={{
            background: 'linear-gradient(180deg, var(--color-white) 0%, var(--color-gray-50) 100%)'
          }}>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your health..."
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-300 text-base"
                  style={{
                    focusRingColor: 'var(--color-primary)',
                    borderColor: 'var(--color-gray-300)',
                    backgroundColor: 'var(--color-white)'
                  }}
                  rows="2"
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 right-4 text-xs text-gray-400">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-8 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-teal) 100%)',
                  color: 'white'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="font-semibold">Send</span>
              </button>
            </div>
            
            {/* Enhanced Disclaimer */}
            <div className="mt-6 p-4 rounded-2xl border-2" style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              borderColor: '#F59E0B'
            }}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6" style={{color: '#F59E0B'}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{color: '#92400E'}}>
                    Medical Disclaimer
                  </p>
                  <p className="text-sm mt-1" style={{color: '#92400E'}}>
                    This AI assistant provides general health information only. Please consult qualified healthcare professionals for medical advice, diagnosis, or treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .focus\\:ring-4:focus {
          --tw-ring-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
};

export default ChatbotPage;
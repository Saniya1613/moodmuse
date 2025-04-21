// src/hooks/useJournalChat.js
import { useState } from 'react';

export const useJournalChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (input) => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    // Add user message immediately
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'MuseMood Journal'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            { 
              role: 'system', 
              content: 'You are a friendly mood journaling assistant. Provide thoughtful, empathetic responses to help users reflect on their feelings. Keep responses concise but meaningful.' 
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            userMessage
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = { 
        role: 'assistant', 
        content: data.choices[0]?.message?.content || "I couldn't generate a response. Please try again." 
      };

      setMessages(prev => [...prev, assistantMessage]);
      return assistantMessage.content;
    } catch (err) {
      setError("Sorry, I couldn't process your message. Please try again.");
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Oops! Something went wrong. Please try again later." 
      }]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return { 
    messages, 
    isLoading, 
    error, 
    sendMessage,
    clearChat
  };
};
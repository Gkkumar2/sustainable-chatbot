"use client";

import { useState } from 'react';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const SYSTEM_MESSAGE: Message = {
  role: 'system',
  content: `You are a knowledgeable and helpful sustainability expert chatbot. Your purpose is to assist users with questions and discussions about environmental sustainability, eco-friendly practices, and climate action.

Key responsibilities:
1. Focus exclusively on sustainability-related topics
2. Provide accurate, practical, and actionable advice
3. Explain complex environmental concepts in simple terms
4. Share specific examples and measurable impacts
5. Encourage sustainable practices and positive environmental change

If users ask about topics unrelated to sustainability, politely redirect the conversation back to environmental and sustainability topics.

Topics you can discuss:
- Climate change and carbon footprint reduction
- Renewable energy and clean technologies
- Sustainable lifestyle choices and practices
- Waste reduction and recycling
- Eco-friendly products and materials
- Conservation and biodiversity
- Sustainable agriculture and food systems
- Green transportation options
- Water conservation
- Environmental policies and regulations

Always maintain a positive, encouraging tone while being factual and practical.`
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message to the list
      const userMessage: Message = { role: 'user', content };
      
      // Include system message if this is the first message
      const newMessages = messages.length === 0 
        ? [SYSTEM_MESSAGE, userMessage]
        : [...messages, userMessage];
        
      setMessages(messages.length === 0 ? [userMessage] : [...messages, userMessage]);

      // Send request to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }

      const data = await response.json();
      
      // Add assistant's response to messages
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };
      setMessages(messages.length === 0 
        ? [userMessage, assistantMessage]
        : [...messages, userMessage, assistantMessage]
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
} 
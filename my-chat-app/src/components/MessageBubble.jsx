import React from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`${isUser ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-800'} max-w-[80%] p-3 rounded-lg shadow-sm`}>
        <div className="text-sm whitespace-pre-line">{message.content}</div>
        <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-gray-500'}`}>{new Date(message.timestamp || Date.now()).toLocaleString()}</div>
      </div>
    </div>
  );
}

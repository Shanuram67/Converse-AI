import React from 'react';

export default function ConversationCard({ convo, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-start"
    >
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{convo.title || 'Untitled'}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{convo.summary || convo.snippet || '—'}</p>
      </div>
      <div className="text-xs text-gray-400 ml-3">{new Date(convo.updated_at || convo.created_at || Date.now()).toLocaleString()}</div>
    </div>
  );
}

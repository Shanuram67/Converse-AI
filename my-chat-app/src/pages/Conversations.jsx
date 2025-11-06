import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listConversations } from '../api';
import ConversationCard from '../components/ConversationCard';
import SearchBar from '../components/SearchBar';

export default function Conversations() {
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    // 1. Set loading state to true before the API call
    setLoading(true);
    try {
      const res = await listConversations();
      // 2. Ensure data is an array or default to an empty array
      // This is crucial for preventing the error if 'res.data' isn't an array
      setConvos(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to fetch conversations:", e);
      // Optional: Handle error state (e.g., display an error message)
      setConvos([]); // Ensure convos is reset to an array on error
    } finally {
      // 3. Set loading state to false after the API call (success or failure)
      setLoading(false);
    }
  };

  // The fix: Add a defensive check to ensure convos is an array
  // before attempting to call .filter().
  const conversationList = Array.isArray(convos) ? convos : [];
  
  const filtered = conversationList.filter(c => {
    if (!query) return true;
    const q = query.toLowerCase();
    // Safely access properties with optional chaining or empty string fallback
    return (c.title || '').toLowerCase().includes(q) || (c.summary || '').toLowerCase().includes(q);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white p-4 rounded-lg shadow">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by title, keywords or date"/>
        </div>
        <div className="mt-4 space-y-3">
          {/* Enhanced Loading and Empty State Display */}
          {loading ? (
            <p className="text-blue-500 font-semibold">Loading conversations...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500">
              {query ? "No conversations match your search." : "No conversations found."}
            </p>
          ) : (
            filtered.map(conv => (
              <ConversationCard 
                key={conv.id} 
                convo={conv} 
                onClick={() => navigate(`/chat/${conv.id}`)} 
              />
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow text-gray-500">
          <p>Select a conversation from the left to view the chat.</p>
        </div>
      </div>
    </div>
  );
}
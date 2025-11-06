import React, { useState } from 'react';
import { queryPast } from '../api';

export default function Intelligence(){
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if(!query.trim()) return;
    setLoading(true);
    try {
      const res = await queryPast({ query });
      setResponse(res.data);
    } catch(e) {
      console.error(e);
      setResponse({ error: 'Error fetching AI response' });
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold">Ask about past conversations</h3>
      <textarea value={query} onChange={(e)=>setQuery(e.target.value)} rows={6} className="mt-3 w-full border rounded p-3" placeholder="Ask a question like: 'What were the actions recommended in conversation on 2025-10-20?'"></textarea>
      <div className="mt-3 flex gap-2">
        <button onClick={handleQuery} className="px-4 py-2 bg-primary-500 text-white rounded" disabled={loading}>{loading ? 'Thinking...' : 'Ask'}</button>
      </div>

      <div className="mt-4">
        {response ? (
          <div className="bg-gray-50 p-4 rounded border">
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(response, null, 2)}</pre>
          </div>
        ) : (
          <p className="text-gray-400">No answer yet</p>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getConversation, startOrSendMessage, endConversation } from '../api';
import MessageBubble from '../components/MessageBubble';

export default function Chat(){
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const listRef = useRef();
   const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchHistory();
  }, [id]);

  useEffect(() => {
    // auto-scroll to bottom on messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, aiTyping]);

  const fetchHistory = async () => {
    try {
      const res = await getConversation(id);
      setMessages(res.data.messages || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: `local-${Date.now()}`, sender: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAiTyping(true);

    try {
      // payload depends on your backend contract
      const payload = { conversation_id: id, message: input };
      const res = await startOrSendMessage(payload);
      // append returned ai message
      const aiMsg = res.data.ai_message || { sender: 'ai', content: res.data.reply || 'No reply', timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
    } catch(err){
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', content: 'Error: could not deliver message.', timestamp: new Date().toISOString() }]);
    } finally {
      setAiTyping(false);
    }
  };

const handleStartNew = async () => {
  try {
    const res = await startOrSendMessage({ message: "Hello" }); // no conversation_id
    const newId = res.data.conversation_id;
    navigate(`/chat/${newId}`);
  } catch (err) {
    console.error(err);
    alert("Failed to start new conversation");
  }
};


  const handleEnd = async () => {
    if(!id) return;
    try {
      await endConversation(id);
      alert('Conversation ended.');
    } catch(e) { console.error(e); alert('Error ending conversation'); }
  };

  return (
    <div className="h-[75vh] flex flex-col bg-white rounded-lg shadow overflow-hidden">
      <div className="p-3 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Conversation</h2>
          <p className="text-xs text-gray-500">ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleStartNew} className="px-3 py-1 bg-primary-500 text-white rounded">Start New</button>
          <button onClick={handleEnd} className="px-3 py-1 border rounded text-gray-600">End</button>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => <MessageBubble key={m.id || m.timestamp} message={m} />)}
        {aiTyping && (
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-sm text-gray-600 rounded-lg px-3 py-2 inline-block">AI is typing<span className="ml-2">...</span></div>
          </div>
        )}
      </div>

      <div className="p-3 border-t">
        <div className="flex gap-3">
          <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && handleSend()} placeholder="Type your message..." className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <button onClick={handleSend} className="px-4 py-2 bg-primary-500 text-white rounded-lg">Send</button>
        </div>
      </div>
    </div>
  );
}

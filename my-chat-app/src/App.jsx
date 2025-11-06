import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Conversations from './pages/Conversations';
import Chat from './pages/Chat';
import Intelligence from './pages/Intelligence';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/conversations" replace />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/conversations/:id" element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} /> {/* ✅ added */}
        <Route path="/intelligence" element={<Intelligence />} />
      </Routes>
    </Layout>
  );
}


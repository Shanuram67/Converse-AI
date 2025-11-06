import React from 'react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 font-sans">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/conversations" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary-500 flex items-center justify-center text-white font-bold">AI</div>
            <div>
              <h1 className="text-lg font-semibold">Converse.ai</h1>
              <p className="text-sm text-gray-500">Ask. Explore. Remember.</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/conversations" className="text-sm hover:text-primary-600">Conversations</Link>
            <Link to="/intelligence" className="text-sm hover:text-primary-600">Intelligence</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} Converse.ai
      </footer>
    </div>
  );
}

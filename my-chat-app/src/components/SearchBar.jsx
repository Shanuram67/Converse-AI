import React from 'react';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-2">
      <input value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
      <button className="px-3 py-2 bg-primary-500 text-white rounded">Search</button>
    </div>
  );
}

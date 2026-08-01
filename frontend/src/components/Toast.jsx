import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div style={{
      background: 'rgba(99, 102, 241, 0.25)',
      border: '1px solid #6366f1',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <i className="fa-solid fa-bolt" style={{ color: '#fbbf24' }}></i>
      <span>{message}</span>
    </div>
  );
}

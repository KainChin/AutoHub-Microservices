import React from 'react';

export default function Header({ health, onRefresh }) {
  const isHealthy = health.status === 'HEALTHY' || health.status === 'UP';

  return (
    <header className="glass-header">
      <div className="brand">
        <i className="fa-solid fa-car-side logo-icon"></i>
        <div>
          <h1>AutoHub Microservices</h1>
          <span className="subtitle">System Architecture & Service Control Center</span>
        </div>
      </div>
      <div className="header-actions">
        <button onClick={onRefresh} className="btn-secondary">
          <i className="fa-solid fa-arrows-rotate"></i> Refresh Status
        </button>
        <span className={`system-status-badge ${isHealthy ? 'badge-healthy' : 'badge-partial'}`}>
          ● SYSTEM {health.status || 'ONLINE'}
        </span>
      </div>
    </header>
  );
}

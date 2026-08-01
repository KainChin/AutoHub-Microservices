import React from 'react';

export default function ArchitectureDiagram({ health }) {
  const getServiceStatus = (name) => {
    const ms = (health.microservices || []).find(m => m.service.includes(name));
    return ms && ms.status === 'UP' ? 'ONLINE' : 'OFFLINE';
  };

  const getStatusColor = (name) => {
    return getServiceStatus(name) === 'ONLINE' ? '#34d399' : '#f87171';
  };

  return (
    <section className="architecture-section glass-panel">
      <h2><i className="fa-solid fa-network-wired"></i> AutoHub Microservices Topology</h2>
      <div className="architecture-grid">
        <div className="arch-node client-node">
          <i className="fa-brands fa-react" style={{ color: '#61dafb' }}></i>
          <span className="node-title">React UI</span>
          <span className="node-port">:8088</span>
        </div>
        <div className="arch-arrow"><i className="fa-solid fa-chevron-right"></i></div>
        <div className="arch-node gateway-node">
          <i className="fa-solid fa-shield-halved"></i>
          <span className="node-title">API Gateway</span>
          <span className="node-port">:5500</span>
          <span className="node-status" style={{ color: '#34d399' }}>ONLINE</span>
        </div>
        <div className="arch-arrow"><i className="fa-solid fa-chevron-right"></i></div>
        <div className="services-cluster">
          <div className="arch-node service-node">
            <i className="fa-solid fa-users"></i>
            <span className="node-title">Customer Svc</span>
            <span className="node-port">:5001</span>
            <span className="node-status" style={{ color: getStatusColor('Customer') }}>{getServiceStatus('Customer')}</span>
          </div>
          <div className="arch-node service-node">
            <i className="fa-solid fa-file-invoice-dollar"></i>
            <span className="node-title">Sales Svc</span>
            <span className="node-port">:5002</span>
            <span className="node-status" style={{ color: getStatusColor('Sales') }}>{getServiceStatus('Sales')}</span>
          </div>
          <div className="arch-node service-node">
            <i className="fa-solid fa-wrench"></i>
            <span className="node-title">Garage Svc</span>
            <span className="node-port">:5003</span>
            <span className="node-status" style={{ color: getStatusColor('Garage') }}>{getServiceStatus('Garage')}</span>
          </div>
          <div className="arch-node service-node">
            <i className="fa-solid fa-gears"></i>
            <span className="node-title">Parts Svc</span>
            <span className="node-port">:5004</span>
            <span className="node-status" style={{ color: getStatusColor('Parts') }}>{getServiceStatus('Parts')}</span>
          </div>
        </div>
        <div className="arch-arrow"><i className="fa-solid fa-chevron-right"></i></div>
        <div className="arch-node db-node">
          <i className="fa-solid fa-database"></i>
          <span className="node-title">SQL Server</span>
          <span className="node-port">:1433</span>
          <span className="node-status" style={{ color: '#34d399' }}>SQL DB</span>
        </div>
      </div>
    </section>
  );
}

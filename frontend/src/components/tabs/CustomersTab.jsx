import React from 'react';

export default function CustomersTab({ customers, searchCust, onSearchChange, onOpenAdd, onDelete }) {
  return (
    <main className="tab-content active">
      <div className="glass-panel">
        <div className="panel-header">
          <h3><i className="fa-solid fa-users"></i> Customer Microservice Data</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search customer..."
              value={searchCust}
              onChange={onSearchChange}
              style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 14px', borderRadius: '8px' }}
            />
            <button className="btn-primary" onClick={onOpenAdd}>
              <i className="fa-solid fa-plus"></i> Add Customer
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Sex</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan="6" className="loading-cell">No customers found</td></tr>
              ) : (
                customers.map(c => (
                  <tr key={c.custID}>
                    <td><strong>#{c.custID}</strong></td>
                    <td>{c.custName}</td>
                    <td>{c.phone || 'N/A'}</td>
                    <td><span className="badge">{c.sex || 'M'}</span></td>
                    <td>{c.cusAddress || 'N/A'}</td>
                    <td>
                      <button onClick={() => onDelete(c.custID)} className="btn-secondary" style={{ padding: '4px 8px', color: '#f87171' }}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

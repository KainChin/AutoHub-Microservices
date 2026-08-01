import React from 'react';

export default function CarsTab({ cars, invoices, carFilter, onFilterChange, onOpenAddCar, onOpenAddInvoice }) {
  return (
    <main className="tab-content active">
      <div className="grid-2col">
        {/* Vehicle Inventory */}
        <div className="glass-panel">
          <div className="panel-header">
            <h3><i className="fa-solid fa-car"></i> Vehicle Inventory</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={carFilter}
                onChange={onFilterChange}
                style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '8px' }}
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="InService">InService</option>
              </select>
              <button className="btn-primary" onClick={onOpenAddCar}>
                <i className="fa-solid fa-plus"></i> Add Vehicle
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Car ID</th>
                  <th>Model</th>
                  <th>VIN</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(c => (
                  <tr key={c.carID}>
                    <td><strong>#{c.carID}</strong></td>
                    <td>{c.model}</td>
                    <td><code>{c.serialNumber}</code></td>
                    <td><span style={{ color: c.Status === 'Available' ? '#34d399' : c.Status === 'Sold' ? '#fbbf24' : '#60a5fa' }}>{c.Status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Invoices */}
        <div className="glass-panel">
          <div className="panel-header">
            <h3><i className="fa-solid fa-receipt"></i> Sales Invoices</h3>
            <button className="btn-primary" onClick={onOpenAddInvoice}>
              <i className="fa-solid fa-plus"></i> Create Invoice
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Car ID</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(i => (
                  <tr key={i.invoiceID}>
                    <td><strong>INV-#{i.invoiceID}</strong></td>
                    <td>{i.invoiceDate ? i.invoiceDate.split('T')[0] : 'N/A'}</td>
                    <td>#{i.carID}</td>
                    <td><strong style={{ color: '#34d399' }}>${Number(i.price).toLocaleString()}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

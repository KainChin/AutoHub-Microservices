import React, { useState, useEffect } from 'react';

const GATEWAY_URL = 'http://localhost:5500';

export default function App() {
  const [activeTab, setActiveTab] = useState('customers');
  const [health, setHealth] = useState({ status: 'UNKNOWN', microservices: [] });
  
  // Data States
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [parts, setParts] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showCustModal, setShowCustModal] = useState(false);
  const [showCarModal, setShowCarModal] = useState(false);

  // Form Inputs
  const [custForm, setCustForm] = useState({ custID: '', custName: '', phone: '', sex: 'M', cusAddress: '' });
  const [carForm, setCarForm] = useState({ carID: '', model: '', serialNumber: '', colour: 'White', year: 2024 });

  useEffect(() => {
    fetchHealth();
    loadAllData();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/health`);
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setHealth({ status: 'DOWN', microservices: [] });
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadCustomers(),
      loadCars(),
      loadInvoices(),
      loadTickets(),
      loadMechanics(),
      loadParts()
    ]);
    setLoading(false);
  };

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/customers`);
      const json = await res.json();
      setCustomers(json.data || []);
    } catch (e) { setCustomers([]); }
  };

  const loadCars = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/sales/cars`);
      const json = await res.json();
      setCars(json.data || []);
    } catch (e) { setCars([]); }
  };

  const loadInvoices = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/sales/invoices`);
      const json = await res.json();
      setInvoices(json.data || []);
    } catch (e) { setInvoices([]); }
  };

  const loadTickets = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/garage/tickets`);
      const json = await res.json();
      setTickets(json.data || []);
    } catch (e) { setTickets([]); }
  };

  const loadMechanics = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/garage/mechanics`);
      const json = await res.json();
      setMechanics(json.data || []);
    } catch (e) { setMechanics([]); }
  };

  const loadParts = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/parts`);
      const json = await res.json();
      setParts(json.data || []);
    } catch (e) { setParts([]); }
  };

  // Add Customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    await fetch(`${GATEWAY_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(custForm)
    });
    setShowCustModal(false);
    setCustForm({ custID: '', custName: '', phone: '', sex: 'M', cusAddress: '' });
    loadCustomers();
  };

  // Add Car
  const handleAddCar = async (e) => {
    e.preventDefault();
    await fetch(`${GATEWAY_URL}/api/sales/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...carForm, Status: 'Available' })
    });
    setShowCarModal(false);
    setCarForm({ carID: '', model: '', serialNumber: '', colour: 'White', year: 2024 });
    loadCars();
  };

  // Delete Customer
  const handleDeleteCust = async (id) => {
    if (confirm(`Are you sure you want to delete Customer #${id}?`)) {
      await fetch(`${GATEWAY_URL}/api/customers/${id}`, { method: 'DELETE' });
      loadCustomers();
    }
  };

  // Helper for Status Badge
  const getBadgeClass = (status) => {
    if (status === 'HEALTHY' || status === 'UP') return 'badge-healthy';
    if (status === 'PARTIAL_OUTAGE') return 'badge-partial';
    return 'badge-down';
  };

  const getServiceStatus = (name) => {
    const ms = (health.microservices || []).find(m => m.service.includes(name));
    return ms && ms.status === 'UP' ? 'ONLINE' : 'OFFLINE';
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="glass-header">
        <div className="brand">
          <i className="fa-solid fa-car-side logo-icon"></i>
          <div>
            <h1>Car Dealership Microservices (React 18)</h1>
            <span className="subtitle">System Architecture & Service Control Center</span>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={fetchHealth} className="btn-secondary">
            <i className="fa-solid fa-arrows-rotate"></i> Refresh Status
          </button>
          <span className={`system-status-badge ${getBadgeClass(health.status)}`}>
            ● SYSTEM {health.status || 'CHECKING'}
          </span>
        </div>
      </header>

      {/* System Architecture Diagram Panel */}
      <section className="architecture-section glass-panel">
        <h2><i className="fa-solid fa-network-wired"></i> Live System Microservices Topology</h2>
        <div className="architecture-grid">
          <div className="arch-node client-node">
            <i className="fa-brands fa-react" style={{ color: '#61dafb' }}></i>
            <span className="node-title">React 18 Web UI</span>
            <span className="node-port">Port 8080</span>
          </div>
          <div className="arch-arrow"><i className="fa-solid fa-chevron-right"></i></div>
          <div className="arch-node gateway-node">
            <i className="fa-solid fa-shield-halved"></i>
            <span className="node-title">API Gateway</span>
            <span className="node-port">Port 5000</span>
            <span className="node-status" style={{ color: health.status === 'DOWN' ? '#f87171' : '#34d399' }}>
              {health.status === 'DOWN' ? 'OFFLINE' : 'ONLINE'}
            </span>
          </div>
          <div className="arch-arrow"><i className="fa-solid fa-chevron-right"></i></div>
          <div className="services-cluster">
            <div className="arch-node service-node">
              <i className="fa-solid fa-users"></i>
              <span className="node-title">Customer Service</span>
              <span className="node-port">:5001</span>
              <span className="node-status" style={{ color: getServiceStatus('Customer') === 'ONLINE' ? '#34d399' : '#f87171' }}>
                {getServiceStatus('Customer')}
              </span>
            </div>
            <div className="arch-node service-node">
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <span className="node-title">Sales Service</span>
              <span className="node-port">:5002</span>
              <span className="node-status" style={{ color: getServiceStatus('Sales') === 'ONLINE' ? '#34d399' : '#f87171' }}>
                {getServiceStatus('Sales')}
              </span>
            </div>
            <div className="arch-node service-node">
              <i className="fa-solid fa-wrench"></i>
              <span className="node-title">Garage Service</span>
              <span className="node-port">:5003</span>
              <span className="node-status" style={{ color: getServiceStatus('Garage') === 'ONLINE' ? '#34d399' : '#f87171' }}>
                {getServiceStatus('Garage')}
              </span>
            </div>
            <div className="arch-node service-node">
              <i className="fa-solid fa-gears"></i>
              <span className="node-title">Parts Service</span>
              <span className="node-port">:5004</span>
              <span className="node-status" style={{ color: getServiceStatus('Parts') === 'ONLINE' ? '#34d399' : '#f87171' }}>
                {getServiceStatus('Parts')}
              </span>
            </div>
          </div>
          <div className="arch-arrow"><i className="fa-solid fa-chevron-right"></i></div>
          <div className="arch-node db-node">
            <i className="fa-solid fa-database"></i>
            <span className="node-title">SQL Server DB</span>
            <span className="node-port">Port 1433</span>
            <span className="node-status" style={{ color: '#34d399' }}>SQL Server</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="nav-tabs">
        <button className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
          <i className="fa-solid fa-user-group"></i> Customers
        </button>
        <button className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`} onClick={() => setActiveTab('cars')}>
          <i className="fa-solid fa-car"></i> Cars & Sales
        </button>
        <button className={`tab-btn ${activeTab === 'garage' ? 'active' : ''}`} onClick={() => setActiveTab('garage')}>
          <i className="fa-solid fa-screwdriver-wrench"></i> Service Tickets
        </button>
        <button className={`tab-btn ${activeTab === 'parts' ? 'active' : ''}`} onClick={() => setActiveTab('parts')}>
          <i className="fa-solid fa-box-open"></i> Spare Parts
        </button>
      </nav>

      {/* Tab Contents */}
      {activeTab === 'customers' && (
        <main className="tab-content active">
          <div className="glass-panel">
            <div className="panel-header">
              <h3><i className="fa-solid fa-users"></i> Customer Microservice Data</h3>
              <button className="btn-primary" onClick={() => setShowCustModal(true)}>
                <i className="fa-solid fa-plus"></i> Add Customer
              </button>
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
                    <tr><td colSpan="6" className="loading-cell">No customers found or microservice disconnected</td></tr>
                  ) : (
                    customers.map(c => (
                      <tr key={c.custID}>
                        <td><strong>#{c.custID}</strong></td>
                        <td>{c.custName}</td>
                        <td>{c.phone || 'N/A'}</td>
                        <td><span className="badge">{c.sex || 'M'}</span></td>
                        <td>{c.cusAddress || 'N/A'}</td>
                        <td>
                          <button onClick={() => handleDeleteCust(c.custID)} className="btn-secondary" style={{ padding: '4px 8px', color: '#f87171' }}>
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
      )}

      {activeTab === 'cars' && (
        <main className="tab-content active">
          <div className="grid-2col">
            <div className="glass-panel">
              <div className="panel-header">
                <h3><i className="fa-solid fa-car"></i> Vehicle Inventory</h3>
                <button className="btn-primary" onClick={() => setShowCarModal(true)}>
                  <i className="fa-solid fa-plus"></i> Add Vehicle
                </button>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Car ID</th>
                      <th>Model</th>
                      <th>VIN</th>
                      <th>Colour</th>
                      <th>Year</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map(c => (
                      <tr key={c.carID}>
                        <td><strong>#{c.carID}</strong></td>
                        <td>{c.model}</td>
                        <td><code>{c.serialNumber}</code></td>
                        <td>{c.colour}</td>
                        <td>{c.year}</td>
                        <td><span style={{ color: c.Status === 'Available' ? '#34d399' : '#fbbf24' }}>{c.Status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel">
              <div className="panel-header">
                <h3><i className="fa-solid fa-receipt"></i> Sales Invoices</h3>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Date</th>
                      <th>Sales Rep</th>
                      <th>Car ID</th>
                      <th>Cust ID</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(i => (
                      <tr key={i.invoiceID}>
                        <td><strong>INV-#{i.invoiceID}</strong></td>
                        <td>{i.invoiceDate ? i.invoiceDate.split('T')[0] : 'N/A'}</td>
                        <td>#{i.salesID}</td>
                        <td>#{i.carID}</td>
                        <td>#{i.custID}</td>
                        <td><strong style={{ color: '#34d399' }}>${Number(i.price).toLocaleString()}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      )}

      {activeTab === 'garage' && (
        <main className="tab-content active">
          <div className="grid-2col">
            <div className="glass-panel">
              <div className="panel-header">
                <h3><i className="fa-solid fa-clipboard-list"></i> Service Tickets</h3>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Date Received</th>
                      <th>Date Returned</th>
                      <th>Cust ID</th>
                      <th>Car ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.serviceTicketID}>
                        <td><strong>TICKET-#{t.serviceTicketID}</strong></td>
                        <td>{t.dateReceived ? t.dateReceived.split('T')[0] : 'N/A'}</td>
                        <td>{t.dateReturned ? t.dateReturned.split('T')[0] : 'In Progress'}</td>
                        <td>#{t.custID}</td>
                        <td>#{t.carID}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel">
              <div className="panel-header">
                <h3><i className="fa-solid fa-user-gear"></i> Mechanics List</h3>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mechanic ID</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mechanics.map(m => (
                      <tr key={m.mechanicID}>
                        <td><strong>#{m.mechanicID}</strong></td>
                        <td>{m.mechanicName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      )}

      {activeTab === 'parts' && (
        <main className="tab-content active">
          <div className="glass-panel">
            <div className="panel-header">
              <h3><i className="fa-solid fa-gears"></i> Spare Parts Catalog</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Part ID</th>
                    <th>Part Name</th>
                    <th>Purchase Price</th>
                    <th>Retail Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map(p => (
                    <tr key={p.partID}>
                      <td><strong>#{p.partID}</strong></td>
                      <td>{p.partName}</td>
                      <td>${Number(p.purchasePrice).toLocaleString()}</td>
                      <td><strong style={{ color: '#34d399' }}>${Number(p.retailPrice).toLocaleString()}</strong></td>
                      <td><span style={{ color: '#34d399' }}>{p.Status || 'Active'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* Add Customer Modal */}
      {showCustModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button className="close-modal" onClick={() => setShowCustModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddCustomer}>
              <div className="form-group">
                <label>Customer ID</label>
                <input type="number" value={custForm.custID} onChange={e => setCustForm({ ...custForm, custID: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Customer Name</label>
                <input type="text" value={custForm.custName} onChange={e => setCustForm({ ...custForm, custName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" value={custForm.phone} onChange={e => setCustForm({ ...custForm, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Sex</label>
                <select value={custForm.sex} onChange={e => setCustForm({ ...custForm, sex: e.target.value })}>
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={custForm.cusAddress} onChange={e => setCustForm({ ...custForm, cusAddress: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Car Modal */}
      {showCarModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Add New Vehicle</h3>
              <button className="close-modal" onClick={() => setShowCarModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddCar}>
              <div className="form-group">
                <label>Car ID</label>
                <input type="number" value={carForm.carID} onChange={e => setCarForm({ ...carForm, carID: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input type="text" value={carForm.model} onChange={e => setCarForm({ ...carForm, model: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Serial Number (VIN)</label>
                <input type="text" value={carForm.serialNumber} onChange={e => setCarForm({ ...carForm, serialNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Colour</label>
                <input type="text" value={carForm.colour} onChange={e => setCarForm({ ...carForm, colour: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="number" value={carForm.year} onChange={e => setCarForm({ ...carForm, year: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

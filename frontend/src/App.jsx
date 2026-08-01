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

  // Search & Filter
  const [searchCust, setSearchCust] = useState('');
  const [carFilter, setCarFilter] = useState('');

  // Event Banner
  const [eventToast, setEventToast] = useState(null);

  // Modal States
  const [showCustModal, setShowCustModal] = useState(false);
  const [showCarModal, setShowCarModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Form Inputs
  const [custForm, setCustForm] = useState({ custID: '', custName: '', phone: '', sex: 'M', cusAddress: '' });
  const [carForm, setCarForm] = useState({ carID: '', model: '', serialNumber: '', colour: 'White', year: 2024 });
  const [invoiceForm, setInvoiceForm] = useState({ salesID: 301, carID: '', custID: '', price: 1850000000 });
  const [ticketForm, setTicketForm] = useState({ custID: '', carID: '' });

  useEffect(() => {
    fetchHealth();
    loadAllData();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg) => {
    setEventToast(msg);
    setTimeout(() => setEventToast(null), 5000);
  };

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
    loadCustomers();
    loadCars();
    loadInvoices();
    loadTickets();
    loadMechanics();
    loadParts();
  };

  const loadCustomers = async (query = '') => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/customers${query ? `?q=${query}` : ''}`);
      const json = await res.json();
      setCustomers(json.data || []);
    } catch (e) { setCustomers([]); }
  };

  const loadCars = async (status = '') => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/sales/cars${status ? `?status=${status}` : ''}`);
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
    triggerToast('✅ Customer registered successfully!');
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
    triggerToast('🚘 Vehicle added to showroom inventory!');
  };

  // Add Sales Invoice
  const handleAddInvoice = async (e) => {
    e.preventDefault();
    const res = await fetch(`${GATEWAY_URL}/api/sales/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceForm)
    });
    const json = await res.json();
    if (res.ok) {
      setShowInvoiceModal(false);
      loadInvoices();
      loadCars();
      triggerToast(`📢 Kafka Event: CarSoldEvent emitted for Car #${invoiceForm.carID}!`);
    } else {
      alert(json.error || 'Failed to create invoice');
    }
  };

  // Create Service Ticket
  const handleAddTicket = async (e) => {
    e.preventDefault();
    await fetch(`${GATEWAY_URL}/api/garage/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketForm)
    });
    setShowTicketModal(false);
    loadTickets();
    loadCars();
    triggerToast('🔧 Service Ticket created & Car set to InService!');
  };

  // Complete Service Ticket
  const handleCompleteTicket = async (id) => {
    if (confirm(`Complete Service Ticket #${id}?`)) {
      await fetch(`${GATEWAY_URL}/api/garage/tickets/${id}/complete`, { method: 'PUT' });
      loadTickets();
      loadCars();
      triggerToast(`📢 Kafka Event: ServiceCompletedEvent emitted for Ticket #${id}!`);
    }
  };

  // Delete Customer
  const handleDeleteCust = async (id) => {
    if (confirm(`Are you sure you want to delete Customer #${id}?`)) {
      await fetch(`${GATEWAY_URL}/api/customers/${id}`, { method: 'DELETE' });
      loadCustomers();
    }
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
            <h1>AutoHub Microservices</h1>
            <span className="subtitle">System Architecture & Service Control Center</span>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={fetchHealth} className="btn-secondary">
            <i className="fa-solid fa-arrows-rotate"></i> Refresh Status
          </button>
          <span className={`system-status-badge ${health.status === 'HEALTHY' ? 'badge-healthy' : 'badge-partial'}`}>
            ● SYSTEM {health.status || 'ONLINE'}
          </span>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {eventToast && (
        <div style={{ background: 'rgba(99, 102, 241, 0.25)', border: '1px solid #6366f1', color: '#fff', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-bolt" style={{ color: '#fbbf24' }}></i>
          <span>{eventToast}</span>
        </div>
      )}

      {/* Architecture Topology Diagram */}
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
              <span className="node-status" style={{ color: getServiceStatus('Customer') === 'ONLINE' ? '#34d399' : '#f87171' }}>{getServiceStatus('Customer')}</span>
            </div>
            <div className="arch-node service-node">
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <span className="node-title">Sales Svc</span>
              <span className="node-port">:5002</span>
              <span className="node-status" style={{ color: getServiceStatus('Sales') === 'ONLINE' ? '#34d399' : '#f87171' }}>{getServiceStatus('Sales')}</span>
            </div>
            <div className="arch-node service-node">
              <i className="fa-solid fa-wrench"></i>
              <span className="node-title">Garage Svc</span>
              <span className="node-port">:5003</span>
              <span className="node-status" style={{ color: getServiceStatus('Garage') === 'ONLINE' ? '#34d399' : '#f87171' }}>{getServiceStatus('Garage')}</span>
            </div>
            <div className="arch-node service-node">
              <i className="fa-solid fa-gears"></i>
              <span className="node-title">Parts Svc</span>
              <span className="node-port">:5004</span>
              <span className="node-status" style={{ color: getServiceStatus('Parts') === 'ONLINE' ? '#34d399' : '#f87171' }}>{getServiceStatus('Parts')}</span>
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

      {/* Tab: Customers */}
      {activeTab === 'customers' && (
        <main className="tab-content active">
          <div className="glass-panel">
            <div className="panel-header">
              <h3><i className="fa-solid fa-users"></i> Customer Microservice Data</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={searchCust}
                  onChange={e => { setSearchCust(e.target.value); loadCustomers(e.target.value); }}
                  style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 14px', borderRadius: '8px' }}
                />
                <button className="btn-primary" onClick={() => setShowCustModal(true)}>
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

      {/* Tab: Cars & Sales */}
      {activeTab === 'cars' && (
        <main className="tab-content active">
          <div className="grid-2col">
            <div className="glass-panel">
              <div className="panel-header">
                <h3><i className="fa-solid fa-car"></i> Vehicle Inventory</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={carFilter}
                    onChange={e => { setCarFilter(e.target.value); loadCars(e.target.value); }}
                    style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '8px' }}
                  >
                    <option value="">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="InService">InService</option>
                  </select>
                  <button className="btn-primary" onClick={() => setShowCarModal(true)}>
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
                      <th>Colour</th>
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
                        <td><span style={{ color: c.Status === 'Available' ? '#34d399' : c.Status === 'Sold' ? '#fbbf24' : '#60a5fa' }}>{c.Status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel">
              <div className="panel-header">
                <h3><i className="fa-solid fa-receipt"></i> Sales Invoices</h3>
                <button className="btn-primary" onClick={() => setShowInvoiceModal(true)}>
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
                      <th>Cust ID</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(i => (
                      <tr key={i.invoiceID}>
                        <td><strong>INV-#{i.invoiceID}</strong></td>
                        <td>{i.invoiceDate ? i.invoiceDate.split('T')[0] : 'N/A'}</td>
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

      {/* Tab: Garage Services */}
      {activeTab === 'garage' && (
        <main className="tab-content active">
          <div className="grid-2col">
            <div className="glass-panel">
              <div className="panel-header">
                <h3><i className="fa-solid fa-clipboard-list"></i> Service Tickets</h3>
                <button className="btn-primary" onClick={() => setShowTicketModal(true)}>
                  <i className="fa-solid fa-plus"></i> New Ticket
                </button>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Date Received</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.serviceTicketID}>
                        <td><strong>TICKET-#{t.serviceTicketID}</strong></td>
                        <td>{t.dateReceived ? t.dateReceived.split('T')[0] : 'N/A'}</td>
                        <td>{t.dateReturned ? <span style={{ color: '#34d399' }}>Completed</span> : <span style={{ color: '#fbbf24' }}>In Progress</span>}</td>
                        <td>
                          {!t.dateReturned && (
                            <button onClick={() => handleCompleteTicket(t.serviceTicketID)} className="btn-secondary" style={{ padding: '4px 8px', color: '#34d399' }}>
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel">
              <div className="panel-header">
                <h3><i className="fa-solid fa-user-gear"></i> Mechanics</h3>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
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

      {/* Tab: Spare Parts */}
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
              <div className="modal-footer">
                <button type="submit" className="btn-primary">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Sales Invoice Modal */}
      {showInvoiceModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Create Sales Invoice</h3>
              <button className="close-modal" onClick={() => setShowInvoiceModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddInvoice}>
              <div className="form-group">
                <label>Car ID (Must be Available)</label>
                <input type="number" value={invoiceForm.carID} onChange={e => setInvoiceForm({ ...invoiceForm, carID: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Customer ID</label>
                <input type="number" value={invoiceForm.custID} onChange={e => setInvoiceForm({ ...invoiceForm, custID: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Total Price ($)</label>
                <input type="number" value={invoiceForm.price} onChange={e => setInvoiceForm({ ...invoiceForm, price: e.target.value })} required />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">Emit Sale & Issue Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Ticket Modal */}
      {showTicketModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Create Service Ticket</h3>
              <button className="close-modal" onClick={() => setShowTicketModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddTicket}>
              <div className="form-group">
                <label>Customer ID</label>
                <input type="number" value={ticketForm.custID} onChange={e => setTicketForm({ ...ticketForm, custID: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Car ID</label>
                <input type="number" value={ticketForm.carID} onChange={e => setTicketForm({ ...ticketForm, carID: e.target.value })} required />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">Create Service Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

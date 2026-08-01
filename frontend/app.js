const GATEWAY_URL = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initModals();
  fetchSystemHealth();
  loadAllData();

  document.getElementById('btnRefreshHealth').addEventListener('click', fetchSystemHealth);
  setInterval(fetchSystemHealth, 10000); // Polling every 10s
});

// Navigation Tabs
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// System Microservices Topology Health Check
async function fetchSystemHealth() {
  const badge = document.getElementById('globalStatusBadge');
  try {
    const res = await fetch(`${GATEWAY_URL}/health`);
    const data = await res.json();

    if (data.status === 'HEALTHY') {
      badge.textContent = '● SYSTEM ONLINE';
      badge.className = 'system-status-badge badge-healthy';
    } else {
      badge.textContent = '● PARTIAL OUTAGE';
      badge.className = 'system-status-badge badge-partial';
    }

    document.getElementById('statusGateway').textContent = 'ONLINE (5000)';

    if (data.microservices) {
      data.microservices.forEach(ms => {
        let statusElem = null;
        if (ms.service.includes('Customer')) statusElem = document.getElementById('statusCustomer');
        if (ms.service.includes('Sales')) statusElem = document.getElementById('statusSales');
        if (ms.service.includes('Garage')) statusElem = document.getElementById('statusGarage');
        if (ms.service.includes('Parts')) statusElem = document.getElementById('statusParts');

        if (statusElem) {
          if (ms.status === 'UP') {
            statusElem.textContent = 'ONLINE';
            statusElem.style.color = '#34d399';
          } else {
            statusElem.textContent = 'OFFLINE';
            statusElem.style.color = '#f87171';
          }
        }
      });
    }
  } catch (err) {
    console.warn('Gateway offline or starting up:', err);
    badge.textContent = '● GATEWAY DOWN';
    badge.className = 'system-status-badge badge-down';
    document.getElementById('statusGateway').textContent = 'OFFLINE';
  }
}

// Load Data From Microservices via API Gateway
async function loadAllData() {
  loadCustomers();
  loadCars();
  loadInvoices();
  loadServiceTickets();
  loadMechanics();
  loadParts();
}

async function loadCustomers() {
  const tbody = document.getElementById('tblCustomers');
  try {
    const res = await fetch(`${GATEWAY_URL}/api/customers`);
    const json = await res.json();
    const list = json.data || [];

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">No customers found</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(c => `
      <tr>
        <td><strong>#${c.custID}</strong></td>
        <td>${c.custName}</td>
        <td>${c.phone || 'N/A'}</td>
        <td><span class="badge">${c.sex || 'M'}</span></td>
        <td>${c.cusAddress || 'N/A'}</td>
        <td><button onclick="deleteCustomer(${c.custID})" class="btn-secondary" style="padding:4px 8px; color:#f87171;"><i class="fa-solid fa-trash"></i></button></td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading-cell" style="color:#f87171;">Failed to connect to Customer Microservice</td></tr>';
  }
}

async function loadCars() {
  const tbody = document.getElementById('tblCars');
  try {
    const res = await fetch(`${GATEWAY_URL}/api/sales/cars`);
    const json = await res.json();
    const list = json.data || [];

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">No vehicles found</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(c => `
      <tr>
        <td><strong>#${c.carID}</strong></td>
        <td>${c.model}</td>
        <td><code>${c.serialNumber || 'N/A'}</code></td>
        <td>${c.colour || 'N/A'}</td>
        <td>${c.year || '2024'}</td>
        <td><span class="badge" style="color:${c.Status === 'Available' ? '#34d399' : '#fbbf24'}">${c.Status || 'Active'}</span></td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading-cell" style="color:#f87171;">Failed to connect to Sales Microservice</td></tr>';
  }
}

async function loadInvoices() {
  const tbody = document.getElementById('tblInvoices');
  try {
    const res = await fetch(`${GATEWAY_URL}/api/sales/invoices`);
    const json = await res.json();
    const list = json.data || [];

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">No sales invoices found</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(i => `
      <tr>
        <td><strong>INV-#${i.invoiceID}</strong></td>
        <td>${i.invoiceDate ? i.invoiceDate.split('T')[0] : 'N/A'}</td>
        <td>#${i.salesID} ${i.salesName ? `(${i.salesName})` : ''}</td>
        <td>#${i.carID} ${i.carModel ? `(${i.carModel})` : ''}</td>
        <td>#${i.custID} ${i.custName ? `(${i.custName})` : ''}</td>
        <td><strong style="color:#34d399;">$${Number(i.price).toLocaleString()}</strong></td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading-cell" style="color:#f87171;">Failed to load invoices</td></tr>';
  }
}

async function loadServiceTickets() {
  const tbody = document.getElementById('tblTickets');
  try {
    const res = await fetch(`${GATEWAY_URL}/api/garage/tickets`);
    const json = await res.json();
    const list = json.data || [];

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="loading-cell">No service tickets found</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(t => `
      <tr>
        <td><strong>TICKET-#${t.serviceTicketID}</strong></td>
        <td>${t.dateReceived ? t.dateReceived.split('T')[0] : 'N/A'}</td>
        <td>${t.dateReturned ? t.dateReturned.split('T')[0] : 'In Progress'}</td>
        <td>#${t.custID} ${t.custName ? `(${t.custName})` : ''}</td>
        <td>#${t.carID} ${t.carModel ? `(${t.carModel})` : ''}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="loading-cell" style="color:#f87171;">Failed to connect to Garage Microservice</td></tr>';
  }
}

async function loadMechanics() {
  const tbody = document.getElementById('tblMechanics');
  try {
    const res = await fetch(`${GATEWAY_URL}/api/garage/mechanics`);
    const json = await res.json();
    const list = json.data || [];

    tbody.innerHTML = list.map(m => `
      <tr>
        <td><strong>#${m.mechanicID}</strong></td>
        <td>${m.mechanicName}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="2" class="loading-cell">Failed to load mechanics</td></tr>';
  }
}

async function loadParts() {
  const tbody = document.getElementById('tblParts');
  try {
    const res = await fetch(`${GATEWAY_URL}/api/parts`);
    const json = await res.json();
    const list = json.data || [];

    tbody.innerHTML = list.map(p => `
      <tr>
        <td><strong>#${p.partID}</strong></td>
        <td>${p.partName}</td>
        <td>$${Number(p.purchasePrice).toLocaleString()}</td>
        <td><strong style="color:#34d399;">$${Number(p.retailPrice).toLocaleString()}</strong></td>
        <td><span class="badge" style="color:#34d399;">${p.Status || 'Active'}</span></td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="loading-cell" style="color:#f87171;">Failed to connect to Parts Microservice</td></tr>';
  }
}

// Modal Handlers
function initModals() {
  const modalCust = document.getElementById('modalCustomer');
  const modalCar = document.getElementById('modalCar');

  document.getElementById('btnOpenAddCustomer').addEventListener('click', () => modalCust.classList.add('active'));
  document.getElementById('btnOpenAddCar').addEventListener('click', () => modalCar.classList.add('active'));

  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      modalCust.classList.remove('active');
      modalCar.classList.remove('active');
    });
  });

  // Submit Customer Form
  document.getElementById('formAddCustomer').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      custID: document.getElementById('inputCustID').value,
      custName: document.getElementById('inputCustName').value,
      phone: document.getElementById('inputCustPhone').value,
      sex: document.getElementById('inputCustSex').value,
      cusAddress: document.getElementById('inputCustAddress').value
    };

    await fetch(`${GATEWAY_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    modalCust.classList.remove('active');
    loadCustomers();
  });

  // Submit Car Form
  document.getElementById('formAddCar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      carID: document.getElementById('inputCarID').value,
      model: document.getElementById('inputCarModel').value,
      serialNumber: document.getElementById('inputCarSerial').value,
      colour: document.getElementById('inputCarColour').value,
      year: document.getElementById('inputCarYear').value,
      Status: 'Available'
    };

    await fetch(`${GATEWAY_URL}/api/sales/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    modalCar.classList.remove('active');
    loadCars();
  });
}

// Delete Customer Handler
async function deleteCustomer(id) {
  if (confirm(`Are you sure you want to delete Customer #${id}?`)) {
    await fetch(`${GATEWAY_URL}/api/customers/${id}`, { method: 'DELETE' });
    loadCustomers();
  }
}

const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrong@Passw0rd!',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Car_Dealership',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let inMemoryMechanics = [
  { mechanicID: 401, mechanicName: "Dang Van Minh (Senior Tech)" },
  { mechanicID: 402, mechanicName: "Bui Quoc Tuan (Electrical Spec)" }
];

let inMemoryServices = [
  { serviceID: 1, serviceName: "Bao duong dinh ky 10,000 km", hourlyRate: 250000, Status: "Active" },
  { serviceID: 2, serviceName: "Thay dau dong co & loc dau", hourlyRate: 150000, Status: "Active" },
  { serviceID: 3, serviceName: "Kiem tra he thong phanh", hourlyRate: 200000, Status: "Active" }
];

let inMemoryTickets = [
  { serviceTicketID: 1001, dateReceived: "2024-02-01", dateReturned: "2024-02-02", custID: 102, carID: 204 }
];

let inMemoryServiceMechanics = [
  { serviceTicketID: 1001, serviceID: 1, mechanicID: 401, hours: 2, comment: "Hoan thanh bao duong", rate: 500000 }
];

let dbConnected = false;
let pool = null;

async function initDB() {
  try {
    pool = await sql.connect(dbConfig);
    dbConnected = true;
    console.log('[Garage Service] Connected to SQL Server DB');
  } catch (err) {
    console.log('[Garage Service] SQL Server connection failed, using in-memory mode:', err.message);
    dbConnected = false;
  }
}
initDB();

app.get('/health', (req, res) => {
  res.json({
    service: 'garage-service',
    status: 'UP',
    database: dbConnected ? 'CONNECTED' : 'IN_MEMORY_FALLBACK',
    timestamp: new Date().toISOString()
  });
});

// --- MECHANICS ---
app.get('/api/garage/mechanics', async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.request().query('SELECT mechanicID, mechanicName FROM Mechanic ORDER BY mechanicID DESC');
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  res.json({ source: 'memory', count: inMemoryMechanics.length, data: inMemoryMechanics });
});

app.post('/api/garage/mechanics', async (req, res) => {
  const { mechanicID, mechanicName } = req.body;
  const newMechID = mechanicID || Math.floor(400 + Math.random() * 600);

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('mechanicID', sql.Decimal, newMechID)
        .input('mechanicName', sql.NVarChar, mechanicName)
        .query('INSERT INTO Mechanic (mechanicID, mechanicName) VALUES (@mechanicID, @mechanicName)');
      return res.status(201).json({ message: 'Mechanic added to DB', mechanicID: newMechID });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const newMech = { mechanicID: Number(newMechID), mechanicName };
  inMemoryMechanics.push(newMech);
  res.status(201).json({ message: 'Mechanic added in memory', data: newMech });
});

// --- SERVICES ---
app.get('/api/garage/services', async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.request().query('SELECT serviceID, serviceName, hourlyRate, Status FROM Service ORDER BY serviceID ASC');
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  res.json({ source: 'memory', count: inMemoryServices.length, data: inMemoryServices });
});

app.post('/api/garage/services', async (req, res) => {
  const { serviceID, serviceName, hourlyRate, Status } = req.body;
  const newSvcID = serviceID || inMemoryServices.length + 1;

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('serviceID', sql.Int, newSvcID)
        .input('serviceName', sql.NVarChar, serviceName)
        .input('hourlyRate', sql.Money, hourlyRate || 150000)
        .input('Status', sql.NVarChar, Status || 'Active')
        .query('INSERT INTO Service (serviceID, serviceName, hourlyRate, Status) VALUES (@serviceID, @serviceName, @hourlyRate, @Status)');
      return res.status(201).json({ message: 'Service type added to DB', serviceID: newSvcID });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const newSvc = { serviceID: Number(newSvcID), serviceName, hourlyRate: Number(hourlyRate || 150000), Status: Status || 'Active' };
  inMemoryServices.push(newSvc);
  res.status(201).json({ message: 'Service type added in memory', data: newSvc });
});

// --- SERVICE TICKETS ---
app.get('/api/garage/tickets', async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.request().query(`
        SELECT t.serviceTicketID, t.dateReceived, t.dateReturned, t.custID, cust.custName, t.carID, c.model AS carModel 
        FROM ServiceTicket t
        LEFT JOIN Customer cust ON t.custID = cust.custID
        LEFT JOIN Cars c ON t.carID = c.carID
        ORDER BY t.serviceTicketID DESC
      `);
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  res.json({ source: 'memory', count: inMemoryTickets.length, data: inMemoryTickets });
});

app.post('/api/garage/tickets', async (req, res) => {
  const { custID, carID, dateReturned } = req.body;

  if (dbConnected && pool) {
    try {
      const result = await pool.request()
        .input('custID', sql.Decimal, custID)
        .input('carID', sql.Decimal, carID)
        .input('dateReturned', sql.Date, dateReturned || null)
        .query('INSERT INTO ServiceTicket (dateReceived, dateReturned, custID, carID) VALUES (GETDATE(), @dateReturned, @custID, @carID); SELECT SCOPE_IDENTITY() AS serviceTicketID;');
      return res.status(201).json({ message: 'Service ticket created in DB', serviceTicketID: result.recordset[0].serviceTicketID });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const newTicket = {
    serviceTicketID: 1000 + inMemoryTickets.length + 1,
    dateReceived: new Date().toISOString().split('T')[0],
    dateReturned: dateReturned || null,
    custID: Number(custID),
    carID: Number(carID)
  };
  inMemoryTickets.push(newTicket);
  res.status(201).json({ message: 'Service ticket created in memory', data: newTicket });
});

// --- ASSIGN MECHANIC TO TICKET ---
app.post('/api/garage/tickets/:id/assign-mechanic', async (req, res) => {
  const serviceTicketID = req.params.id;
  const { serviceID, mechanicID, hours, comment, rate } = req.body;

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('serviceTicketID', sql.Int, serviceTicketID)
        .input('serviceID', sql.Int, serviceID)
        .input('mechanicID', sql.Decimal, mechanicID)
        .input('hours', sql.Int, hours || 1)
        .input('comment', sql.NVarChar, comment || '')
        .input('rate', sql.Money, rate || 200000)
        .query('INSERT INTO ServiceMehanic (serviceTicketID, serviceID, mechanicID, hours, comment, rate) VALUES (@serviceTicketID, @serviceID, @mechanicID, @hours, @comment, @rate)');
      return res.status(201).json({ message: 'Mechanic assigned to service ticket in DB' });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const assignment = {
    serviceTicketID: Number(serviceTicketID),
    serviceID: Number(serviceID),
    mechanicID: Number(mechanicID),
    hours: Number(hours || 1),
    comment: comment || '',
    rate: Number(rate || 200000)
  };
  inMemoryServiceMechanics.push(assignment);
  res.status(201).json({ message: 'Mechanic assigned in memory', data: assignment });
});

app.listen(PORT, () => {
  console.log(`[Garage Service] Running on port ${PORT}`);
});

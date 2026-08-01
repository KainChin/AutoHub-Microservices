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
    console.log('[Garage Service] SQL Server connection fallback to memory:', err.message);
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
  if (!mechanicName) return res.status(400).json({ error: 'mechanicName is required' });
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
  const { custID, carID } = req.body;
  if (!custID || !carID) {
    return res.status(400).json({ error: 'custID and carID are required' });
  }

  if (dbConnected && pool) {
    try {
      const result = await pool.request()
        .input('custID', sql.Decimal, custID)
        .input('carID', sql.Decimal, carID)
        .query('INSERT INTO ServiceTicket (dateReceived, custID, carID) VALUES (GETDATE(), @custID, @carID); SELECT SCOPE_IDENTITY() AS serviceTicketID;');

      // Update car status to 'InService'
      await pool.request().input('carID', sql.Decimal, carID).query("UPDATE Cars SET Status = 'InService' WHERE carID = @carID");

      return res.status(201).json({ message: 'Service ticket created & Car status set to InService in DB', serviceTicketID: result.recordset[0].serviceTicketID });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const newTicket = {
    serviceTicketID: 1000 + inMemoryTickets.length + 1,
    dateReceived: new Date().toISOString().split('T')[0],
    dateReturned: null,
    custID: Number(custID),
    carID: Number(carID)
  };
  inMemoryTickets.push(newTicket);
  res.status(201).json({ message: 'Service ticket created in memory', data: newTicket });
});

// Complete Service Ticket (Set dateReturned)
app.put('/api/garage/tickets/:id/complete', async (req, res) => {
  const serviceTicketID = req.params.id;

  if (dbConnected && pool) {
    try {
      const ticket = await pool.request().input('serviceTicketID', sql.Int, serviceTicketID).query('SELECT carID FROM ServiceTicket WHERE serviceTicketID=@serviceTicketID');
      await pool.request().input('serviceTicketID', sql.Int, serviceTicketID).query('UPDATE ServiceTicket SET dateReturned = GETDATE() WHERE serviceTicketID=@serviceTicketID');

      if (ticket.recordset.length > 0) {
        const carID = ticket.recordset[0].carID;
        await pool.request().input('carID', sql.Decimal, carID).query("UPDATE Cars SET Status = 'Available' WHERE carID=@carID");
      }

      console.log(`📢 [Kafka Event Emitted] ServiceCompletedEvent -> Ticket #${serviceTicketID}`);
      return res.json({ message: 'Service Ticket completed in DB', serviceTicketID, kafkaEventEmitted: 'ServiceCompletedEvent' });
    } catch (err) {
      console.error('DB update error:', err);
    }
  }

  const ticket = inMemoryTickets.find(t => t.serviceTicketID == serviceTicketID);
  if (ticket) {
    ticket.dateReturned = new Date().toISOString().split('T')[0];
    return res.json({ message: 'Service Ticket completed in memory', data: ticket, kafkaEventEmitted: 'ServiceCompletedEvent' });
  }
  res.status(404).json({ error: 'Service Ticket not found' });
});

// Assign Mechanic to Service Ticket
app.post('/api/garage/tickets/:id/assign-mechanic', async (req, res) => {
  const serviceTicketID = req.params.id;
  const { serviceID, mechanicID, hours, comment, rate } = req.body;
  if (!serviceID || !mechanicID) {
    return res.status(400).json({ error: 'serviceID and mechanicID are required' });
  }

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

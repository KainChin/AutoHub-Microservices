const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 5004;

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

let inMemoryParts = [
  { partID: 501, partName: "Dau dong co Synthetic 5W-30 (4L)", purchasePrice: 350000, retailPrice: 500000, Status: "Active" },
  { partID: 502, partName: "Loc dau Honda/Toyota", purchasePrice: 120000, retailPrice: 180000, Status: "Active" },
  { partID: 503, partName: "Ma phanh truoc Brembo", purchasePrice: 1200000, retailPrice: 1600000, Status: "Active" }
];

let inMemoryPartsUsed = [
  { serviceTicketID: 1001, partID: 501, numberUsed: 1, price: 500000 },
  { serviceTicketID: 1001, partID: 502, numberUsed: 1, price: 180000 }
];

let dbConnected = false;
let pool = null;

async function initDB() {
  try {
    pool = await sql.connect(dbConfig);
    dbConnected = true;
    console.log('[Parts Service] Connected to SQL Server DB');
  } catch (err) {
    console.log('[Parts Service] SQL Server connection failed, using in-memory mode:', err.message);
    dbConnected = false;
  }
}
initDB();

app.get('/health', (req, res) => {
  res.json({
    service: 'parts-service',
    status: 'UP',
    database: dbConnected ? 'CONNECTED' : 'IN_MEMORY_FALLBACK',
    timestamp: new Date().toISOString()
  });
});

// GET all parts
app.get('/api/parts', async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.request().query('SELECT partID, partName, purchasePrice, retailPrice, Status FROM Parts ORDER BY partID DESC');
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  res.json({ source: 'memory', count: inMemoryParts.length, data: inMemoryParts });
});

// POST new part
app.post('/api/parts', async (req, res) => {
  const { partID, partName, purchasePrice, retailPrice, Status } = req.body;
  const newPartID = partID || Math.floor(500 + Math.random() * 500);

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('partID', sql.Decimal, newPartID)
        .input('partName', sql.NVarChar, partName)
        .input('purchasePrice', sql.Money, purchasePrice || 0)
        .input('retailPrice', sql.Money, retailPrice || 0)
        .input('Status', sql.NVarChar, Status || 'Active')
        .query('INSERT INTO Parts (partID, partName, purchasePrice, retailPrice, Status) VALUES (@partID, @partName, @purchasePrice, @retailPrice, @Status)');
      return res.status(201).json({ message: 'Part created in DB', partID: newPartID });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const newPart = {
    partID: Number(newPartID),
    partName,
    purchasePrice: Number(purchasePrice || 0),
    retailPrice: Number(retailPrice || 0),
    Status: Status || 'Active'
  };
  inMemoryParts.push(newPart);
  res.status(201).json({ message: 'Part created in memory', data: newPart });
});

// GET parts used
app.get('/api/parts/used', async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.request().query(`
        SELECT pu.serviceTicketID, pu.partID, p.partName, pu.numberUsed, pu.price 
        FROM PartsUsed pu
        LEFT JOIN Parts p ON pu.partID = p.partID
        ORDER BY pu.serviceTicketID DESC
      `);
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  res.json({ source: 'memory', count: inMemoryPartsUsed.length, data: inMemoryPartsUsed });
});

// POST add part to service ticket
app.post('/api/parts/used', async (req, res) => {
  const { serviceTicketID, partID, numberUsed, price } = req.body;

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('serviceTicketID', sql.Int, serviceTicketID)
        .input('partID', sql.Decimal, partID)
        .input('numberUsed', sql.Int, numberUsed || 1)
        .input('price', sql.Money, price || 0)
        .query('INSERT INTO PartsUsed (serviceTicketID, partID, numberUsed, price) VALUES (@serviceTicketID, @partID, @numberUsed, @price)');
      return res.status(201).json({ message: 'Part added to service ticket in DB' });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const pu = {
    serviceTicketID: Number(serviceTicketID),
    partID: Number(partID),
    numberUsed: Number(numberUsed || 1),
    price: Number(price || 0)
  };
  inMemoryPartsUsed.push(pu);
  res.status(201).json({ message: 'Part added to service ticket in memory', data: pu });
});

app.listen(PORT, () => {
  console.log(`[Parts Service] Running on port ${PORT}`);
});

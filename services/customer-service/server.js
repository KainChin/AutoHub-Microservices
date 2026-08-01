const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 5001;

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

let inMemoryCustomers = [
  { custID: 101, custName: "Nguyen Van A", phone: "0901234567", sex: "M", cusAddress: "123 Le Loi, District 1, HCMC" },
  { custID: 102, custName: "Tran Thi B", phone: "0918765432", sex: "F", cusAddress: "456 Nguyen Hue, District 1, HCMC" },
  { custID: 103, custName: "Pham Van C", phone: "0988112233", sex: "M", cusAddress: "789 Tran Hung Dao, District 5, HCMC" }
];

let dbConnected = false;
let pool = null;

async function initDB() {
  try {
    pool = await sql.connect(dbConfig);
    dbConnected = true;
    console.log('[Customer Service] Connected to SQL Server DB');
  } catch (err) {
    console.log('[Customer Service] SQL Server connection failed, using in-memory mode:', err.message);
    dbConnected = false;
  }
}
initDB();

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'customer-service',
    status: 'UP',
    database: dbConnected ? 'CONNECTED' : 'IN_MEMORY_FALLBACK',
    timestamp: new Date().toISOString()
  });
});

// GET all customers
app.get('/api/customers', async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.request().query('SELECT custID, custName, phone, sex, cusAddress FROM Customer ORDER BY custID DESC');
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  res.json({ source: 'memory', count: inMemoryCustomers.length, data: inMemoryCustomers });
});

// GET single customer
app.get('/api/customers/:id', async (req, res) => {
  const id = req.params.id;
  if (dbConnected && pool) {
    try {
      const result = await pool.request()
        .input('custID', sql.Decimal, id)
        .query('SELECT custID, custName, phone, sex, cusAddress FROM Customer WHERE custID = @custID');
      if (result.recordset.length > 0) {
        return res.json({ source: 'database', data: result.recordset[0] });
      }
      return res.status(404).json({ error: 'Customer not found' });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  const cust = inMemoryCustomers.find(c => c.custID == id);
  if (cust) return res.json({ source: 'memory', data: cust });
  res.status(404).json({ error: 'Customer not found' });
});

// POST new customer
app.post('/api/customers', async (req, res) => {
  const { custID, custName, phone, sex, cusAddress } = req.body;
  const newId = custID || Math.floor(100 + Math.random() * 900);

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('custID', sql.Decimal, newId)
        .input('custName', sql.NVarChar, custName)
        .input('phone', sql.Decimal, phone || null)
        .input('sex', sql.Char, sex || 'M')
        .input('cusAddress', sql.NVarChar, cusAddress || '')
        .query('INSERT INTO Customer (custID, custName, phone, sex, cusAddress) VALUES (@custID, @custName, @phone, @sex, @cusAddress)');
      return res.status(201).json({ message: 'Customer created in DB', custID: newId });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const newCust = { custID: Number(newId), custName, phone, sex, cusAddress };
  inMemoryCustomers.push(newCust);
  res.status(201).json({ message: 'Customer created in memory', data: newCust });
});

// DELETE customer
app.delete('/api/customers/:id', async (req, res) => {
  const id = req.params.id;
  if (dbConnected && pool) {
    try {
      await pool.request().input('custID', sql.Decimal, id).query('DELETE FROM Customer WHERE custID = @custID');
      return res.json({ message: 'Customer deleted from DB' });
    } catch (err) {
      console.error('DB delete error:', err);
    }
  }
  inMemoryCustomers = inMemoryCustomers.filter(c => c.custID != id);
  res.json({ message: 'Customer deleted from memory' });
});

app.listen(PORT, () => {
  console.log(`[Customer Service] Running on port ${PORT}`);
});

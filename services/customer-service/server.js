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
    console.log('[Customer Service] SQL Server connection fallback to memory:', err.message);
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
  const search = req.query.q;
  if (dbConnected && pool) {
    try {
      let query = 'SELECT custID, custName, phone, sex, cusAddress FROM Customer';
      if (search) {
        query += ` WHERE custName LIKE N'%${search}%' OR CAST(custID AS VARCHAR) LIKE '%${search}%'`;
      }
      query += ' ORDER BY custID DESC';
      const result = await pool.request().query(query);
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  let filtered = inMemoryCustomers;
  if (search) {
    filtered = filtered.filter(c => c.custName.toLowerCase().includes(search.toLowerCase()) || String(c.custID).includes(search));
  }
  res.json({ source: 'memory', count: filtered.length, data: filtered });
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

// POST new customer (Validation included)
app.post('/api/customers', async (req, res) => {
  const { custID, custName, phone, sex, cusAddress } = req.body;
  if (!custName || custName.trim() === '') {
    return res.status(400).json({ error: 'Customer name (custName) is required' });
  }

  const newId = custID || Math.floor(100 + Math.random() * 900);

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('custID', sql.Decimal, newId)
        .input('custName', sql.NVarChar, custName.trim())
        .input('phone', sql.Decimal, phone || null)
        .input('sex', sql.Char, sex || 'M')
        .input('cusAddress', sql.NVarChar, cusAddress || '')
        .query('INSERT INTO Customer (custID, custName, phone, sex, cusAddress) VALUES (@custID, @custName, @phone, @sex, @cusAddress)');
      return res.status(201).json({ message: 'Customer created in DB', custID: newId });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const newCust = { custID: Number(newId), custName: custName.trim(), phone, sex: sex || 'M', cusAddress: cusAddress || '' };
  inMemoryCustomers.push(newCust);
  res.status(201).json({ message: 'Customer created in memory', data: newCust });
});

// PUT update customer
app.put('/api/customers/:id', async (req, res) => {
  const id = req.params.id;
  const { custName, phone, sex, cusAddress } = req.body;

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('custID', sql.Decimal, id)
        .input('custName', sql.NVarChar, custName)
        .input('phone', sql.Decimal, phone || null)
        .input('sex', sql.Char, sex || 'M')
        .input('cusAddress', sql.NVarChar, cusAddress || '')
        .query('UPDATE Customer SET custName=@custName, phone=@phone, sex=@sex, cusAddress=@cusAddress WHERE custID=@custID');
      return res.json({ message: 'Customer updated in DB', custID: id });
    } catch (err) {
      console.error('DB update error:', err);
    }
  }

  const index = inMemoryCustomers.findIndex(c => c.custID == id);
  if (index !== -1) {
    inMemoryCustomers[index] = { ...inMemoryCustomers[index], custName, phone, sex, cusAddress };
    return res.json({ message: 'Customer updated in memory', data: inMemoryCustomers[index] });
  }
  res.status(404).json({ error: 'Customer not found' });
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

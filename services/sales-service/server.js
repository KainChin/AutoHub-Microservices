const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 5002;

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

let inMemoryCars = [
  { carID: 201, serialNumber: "VIN-TOY-001", model: "Toyota Camry 2.5Q", colour: "Black", year: 2023, Status: "Available" },
  { carID: 202, serialNumber: "VIN-HON-002", model: "Honda CR-V L", colour: "White", year: 2024, Status: "Available" },
  { carID: 203, serialNumber: "VIN-BMW-003", model: "BMW 330i M Sport", colour: "Blue", year: 2023, Status: "Sold" }
];

let inMemorySalesPersons = [
  { salesID: 301, salesName: "Le Hoang Nam", birthday: "1992-05-15", sex: "M", salesAddress: "12 Nguyen Thi Minh Khai, HCMC" },
  { salesID: 302, salesName: "Vo Thi Mai", birthday: "1995-11-20", sex: "F", salesAddress: "88 Vo Van Tan, District 3, HCMC" }
];

let inMemoryInvoices = [
  { invoiceID: 1, invoiceDate: "2024-01-10", salesID: 301, carID: 203, custID: 101, price: 1850000000 }
];

let dbConnected = false;
let pool = null;

async function initDB() {
  try {
    pool = await sql.connect(dbConfig);
    dbConnected = true;
    console.log('[Sales Service] Connected to SQL Server DB');
  } catch (err) {
    console.log('[Sales Service] SQL Server connection failed, using in-memory mode:', err.message);
    dbConnected = false;
  }
}
initDB();

app.get('/health', (req, res) => {
  res.json({
    service: 'sales-service',
    status: 'UP',
    database: dbConnected ? 'CONNECTED' : 'IN_MEMORY_FALLBACK',
    timestamp: new Date().toISOString()
  });
});

// --- CARS ENDPOINTS ---
app.get('/api/sales/cars', async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.request().query('SELECT carID, serialNumber, model, colour, year, Status FROM Cars ORDER BY carID DESC');
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  res.json({ source: 'memory', count: inMemoryCars.length, data: inMemoryCars });
});

app.post('/api/sales/cars', async (req, res) => {
  const { carID, serialNumber, model, colour, year, Status } = req.body;
  const newCarID = carID || Math.floor(200 + Math.random() * 800);

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('carID', sql.Decimal, newCarID)
        .input('serialNumber', sql.NVarChar, serialNumber || `VIN-${Date.now()}`)
        .input('model', sql.NVarChar, model)
        .input('colour', sql.NVarChar, colour || 'White')
        .input('year', sql.Int, year || 2024)
        .input('Status', sql.NVarChar, Status || 'Available')
        .query('INSERT INTO Cars (carID, serialNumber, model, colour, year, Status) VALUES (@carID, @serialNumber, @model, @colour, @year, @Status)');
      return res.status(201).json({ message: 'Car created in DB', carID: newCarID });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const newCar = { carID: Number(newCarID), serialNumber: serialNumber || `VIN-${Date.now()}`, model, colour: colour || 'White', year: year || 2024, Status: Status || 'Available' };
  inMemoryCars.push(newCar);
  res.status(201).json({ message: 'Car created in memory', data: newCar });
});

// --- SALESPERSON ENDPOINTS ---
app.get('/api/sales/salespersons', async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.request().query('SELECT salesID, salesName, birthday, sex, salesAddress FROM SalesPerson ORDER BY salesID DESC');
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  res.json({ source: 'memory', count: inMemorySalesPersons.length, data: inMemorySalesPersons });
});

app.post('/api/sales/salespersons', async (req, res) => {
  const { salesID, salesName, birthday, sex, salesAddress } = req.body;
  const newSalesID = salesID || Math.floor(300 + Math.random() * 700);

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('salesID', sql.Decimal, newSalesID)
        .input('salesName', sql.NVarChar, salesName)
        .input('birthday', sql.Date, birthday || '1990-01-01')
        .input('sex', sql.Char, sex || 'M')
        .input('salesAddress', sql.NVarChar, salesAddress || '')
        .query('INSERT INTO SalesPerson (salesID, salesName, birthday, sex, salesAddress) VALUES (@salesID, @salesName, @birthday, @sex, @salesAddress)');
      return res.status(201).json({ message: 'SalesPerson created in DB', salesID: newSalesID });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const newSp = { salesID: Number(newSalesID), salesName, birthday: birthday || '1990-01-01', sex: sex || 'M', salesAddress: salesAddress || '' };
  inMemorySalesPersons.push(newSp);
  res.status(201).json({ message: 'SalesPerson created in memory', data: newSp });
});

// --- INVOICES ENDPOINTS ---
app.get('/api/sales/invoices', async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.request().query(`
        SELECT i.invoiceID, i.invoiceDate, i.salesID, sp.salesName, i.carID, c.model AS carModel, i.custID, cust.custName, i.price 
        FROM SalesInvoice i
        LEFT JOIN SalesPerson sp ON i.salesID = sp.salesID
        LEFT JOIN Cars c ON i.carID = c.carID
        LEFT JOIN Customer cust ON i.custID = cust.custID
        ORDER BY i.invoiceID DESC
      `);
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }
  res.json({ source: 'memory', count: inMemoryInvoices.length, data: inMemoryInvoices });
});

app.post('/api/sales/invoices', async (req, res) => {
  const { salesID, carID, custID, price } = req.body;

  if (dbConnected && pool) {
    try {
      const result = await pool.request()
        .input('salesID', sql.Decimal, salesID)
        .input('carID', sql.Decimal, carID)
        .input('custID', sql.Decimal, custID)
        .input('price', sql.Int, price)
        .query('INSERT INTO SalesInvoice (invoiceDate, salesID, carID, custID, price) VALUES (GETDATE(), @salesID, @carID, @custID, @price); SELECT SCOPE_IDENTITY() AS invoiceID;');

      // Also update car status to 'Sold'
      await pool.request().input('carID', sql.Decimal, carID).query("UPDATE Cars SET Status = 'Sold' WHERE carID = @carID");

      return res.status(201).json({ message: 'Invoice generated in DB', invoiceID: result.recordset[0].invoiceID });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const newInv = {
    invoiceID: inMemoryInvoices.length + 1,
    invoiceDate: new Date().toISOString().split('T')[0],
    salesID: Number(salesID),
    carID: Number(carID),
    custID: Number(custID),
    price: Number(price)
  };
  inMemoryInvoices.push(newInv);
  // Update in-memory car status
  const car = inMemoryCars.find(c => c.carID == carID);
  if (car) car.Status = 'Sold';

  res.status(201).json({ message: 'Invoice created in memory', data: newInv });
});

app.listen(PORT, () => {
  console.log(`[Sales Service] Running on port ${PORT}`);
});

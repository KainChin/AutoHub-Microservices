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
    console.log('[Sales Service] SQL Server connection fallback to memory:', err.message);
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
  const statusFilter = req.query.status;
  if (dbConnected && pool) {
    try {
      let query = 'SELECT carID, serialNumber, model, colour, year, Status FROM Cars';
      if (statusFilter) {
        query += ` WHERE Status = N'${statusFilter}'`;
      }
      query += ' ORDER BY carID DESC';
      const result = await pool.request().query(query);
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error('DB query error:', err);
    }
  }

  let list = inMemoryCars;
  if (statusFilter) {
    list = list.filter(c => c.Status.toLowerCase() === statusFilter.toLowerCase());
  }
  res.json({ source: 'memory', count: list.length, data: list });
});

app.post('/api/sales/cars', async (req, res) => {
  const { carID, serialNumber, model, colour, year, Status } = req.body;
  if (!model || model.trim() === '') {
    return res.status(400).json({ error: 'Car model is required' });
  }

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

  const newCar = { carID: Number(newCarID), serialNumber: serialNumber || `VIN-${Date.now()}`, model, colour: colour || 'White', year: Number(year || 2024), Status: Status || 'Available' };
  inMemoryCars.push(newCar);
  res.status(201).json({ message: 'Car created in memory', data: newCar });
});

// Update Car Status
app.put('/api/sales/cars/:id/status', async (req, res) => {
  const carID = req.params.id;
  const { Status } = req.body;

  if (dbConnected && pool) {
    try {
      await pool.request()
        .input('carID', sql.Decimal, carID)
        .input('Status', sql.NVarChar, Status)
        .query('UPDATE Cars SET Status = @Status WHERE carID = @carID');
      return res.json({ message: 'Car status updated in DB', carID, Status });
    } catch (err) {
      console.error('DB update error:', err);
    }
  }

  const car = inMemoryCars.find(c => c.carID == carID);
  if (car) {
    car.Status = Status;
    return res.json({ message: 'Car status updated in memory', data: car });
  }
  res.status(404).json({ error: 'Car not found' });
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
  if (!salesName) return res.status(400).json({ error: 'salesName is required' });

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

// POST Create Sales Invoice (with validation + Car Status update)
app.post('/api/sales/invoices', async (req, res) => {
  const { salesID, carID, custID, price } = req.body;
  if (!salesID || !carID || !custID || !price) {
    return res.status(400).json({ error: 'salesID, carID, custID, and price are required' });
  }

  if (dbConnected && pool) {
    try {
      // 1. Check if car is Available
      const carCheck = await pool.request().input('carID', sql.Decimal, carID).query('SELECT Status FROM Cars WHERE carID=@carID');
      if (carCheck.recordset.length === 0) {
        return res.status(404).json({ error: `Car #${carID} not found` });
      }
      if (carCheck.recordset[0].Status === 'Sold') {
        return res.status(400).json({ error: `Car #${carID} is already Sold` });
      }

      // 2. Insert Invoice
      const result = await pool.request()
        .input('salesID', sql.Decimal, salesID)
        .input('carID', sql.Decimal, carID)
        .input('custID', sql.Decimal, custID)
        .input('price', sql.Int, price)
        .query('INSERT INTO SalesInvoice (invoiceDate, salesID, carID, custID, price) VALUES (GETDATE(), @salesID, @carID, @custID, @price); SELECT SCOPE_IDENTITY() AS invoiceID;');

      // 3. Mark car as 'Sold'
      await pool.request().input('carID', sql.Decimal, carID).query("UPDATE Cars SET Status = 'Sold' WHERE carID = @carID");

      const invoiceID = result.recordset[0].invoiceID;
      console.log(`📢 [Kafka Event Emitted] CarSoldEvent -> Invoice #${invoiceID}, Car #${carID}, Customer #${custID}`);

      return res.status(201).json({
        message: 'Sales Invoice created & Car marked as Sold in DB',
        invoiceID,
        kafkaEventEmitted: 'CarSoldEvent'
      });
    } catch (err) {
      console.error('DB insert error:', err);
    }
  }

  const car = inMemoryCars.find(c => c.carID == carID);
  if (car && car.Status === 'Sold') {
    return res.status(400).json({ error: `Car #${carID} is already Sold` });
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
  if (car) car.Status = 'Sold';

  res.status(201).json({ message: 'Sales Invoice created in memory', data: newInv, kafkaEventEmitted: 'CarSoldEvent' });
});

app.listen(PORT, () => {
  console.log(`[Sales Service] Running on port ${PORT}`);
});

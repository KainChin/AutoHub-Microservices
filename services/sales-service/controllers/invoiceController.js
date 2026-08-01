const { getDbPool } = require('../config/db');
const sql = require('mssql');

let inMemoryInvoices = [
  { invoiceID: 1, invoiceDate: "2024-01-10", salesID: 301, carID: 203, custID: 101, price: 1850000000 }
];

// GET /api/sales/invoices
exports.getAllInvoices = async (req, res) => {
  const pool = await getDbPool();
  if (pool) {
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
    } catch (err) { console.error(err); }
  }
  res.json({ source: 'memory', count: inMemoryInvoices.length, data: inMemoryInvoices });
};

// POST /api/sales/invoices
exports.createInvoice = async (req, res) => {
  const { salesID, carID, custID, price } = req.body;
  if (!salesID || !carID || !custID || !price) {
    return res.status(400).json({ error: 'salesID, carID, custID, and price are required' });
  }

  const pool = await getDbPool();

  if (pool) {
    try {
      const carCheck = await pool.request().input('carID', sql.Decimal, carID).query('SELECT Status FROM Cars WHERE carID=@carID');
      if (carCheck.recordset.length === 0) return res.status(404).json({ error: `Car #${carID} not found` });
      if (carCheck.recordset[0].Status === 'Sold') return res.status(400).json({ error: `Car #${carID} is already Sold` });

      const result = await pool.request()
        .input('salesID', sql.Decimal, salesID)
        .input('carID', sql.Decimal, carID)
        .input('custID', sql.Decimal, custID)
        .input('price', sql.Int, price)
        .query('INSERT INTO SalesInvoice (invoiceDate, salesID, carID, custID, price) VALUES (GETDATE(), @salesID, @carID, @custID, @price); SELECT SCOPE_IDENTITY() AS invoiceID;');

      await pool.request().input('carID', sql.Decimal, carID).query("UPDATE Cars SET Status = 'Sold' WHERE carID = @carID");

      const invoiceID = result.recordset[0].invoiceID;
      console.log(`📢 [Kafka Event Emitted] CarSoldEvent -> Invoice #${invoiceID}, Car #${carID}`);

      return res.status(201).json({ message: 'Invoice created & Car marked as Sold', invoiceID, kafkaEvent: 'CarSoldEvent' });
    } catch (err) { console.error(err); }
  }

  const newInv = { invoiceID: inMemoryInvoices.length + 1, invoiceDate: new Date().toISOString().split('T')[0], salesID: Number(salesID), carID: Number(carID), custID: Number(custID), price: Number(price) };
  inMemoryInvoices.push(newInv);
  res.status(201).json({ message: 'Invoice created in memory', data: newInv, kafkaEvent: 'CarSoldEvent' });
};

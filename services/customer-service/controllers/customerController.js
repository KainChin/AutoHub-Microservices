const { getDbPool } = require('../config/db');
const sql = require('mssql');

let inMemoryCustomers = [
  { custID: 101, custName: "Nguyen Van A", phone: "0901234567", sex: "M", cusAddress: "123 Le Loi, District 1, HCMC" },
  { custID: 102, custName: "Tran Thi B", phone: "0918765432", sex: "F", cusAddress: "456 Nguyen Hue, District 1, HCMC" },
  { custID: 103, custName: "Pham Van C", phone: "0988112233", sex: "M", cusAddress: "789 Tran Hung Dao, District 5, HCMC" }
];

// GET /api/customers
exports.getAllCustomers = async (req, res) => {
  const search = req.query.q;
  const pool = await getDbPool();
  if (pool) {
    try {
      let query = 'SELECT custID, custName, phone, sex, cusAddress FROM Customer';
      if (search) {
        query += ` WHERE custName LIKE N'%${search}%' OR CAST(custID AS VARCHAR) LIKE '%${search}%'`;
      }
      query += ' ORDER BY custID DESC';
      const result = await pool.request().query(query);
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) {
      console.error(err);
    }
  }
  let filtered = inMemoryCustomers;
  if (search) {
    filtered = filtered.filter(c => c.custName.toLowerCase().includes(search.toLowerCase()) || String(c.custID).includes(search));
  }
  res.json({ source: 'memory', count: filtered.length, data: filtered });
};

// GET /api/customers/:id
exports.getCustomerById = async (req, res) => {
  const id = req.params.id;
  const pool = await getDbPool();
  if (pool) {
    try {
      const result = await pool.request()
        .input('custID', sql.Decimal, id)
        .query('SELECT custID, custName, phone, sex, cusAddress FROM Customer WHERE custID = @custID');
      if (result.recordset.length > 0) return res.json({ source: 'database', data: result.recordset[0] });
      return res.status(404).json({ error: 'Customer not found' });
    } catch (err) { console.error(err); }
  }
  const cust = inMemoryCustomers.find(c => c.custID == id);
  if (cust) return res.json({ source: 'memory', data: cust });
  res.status(404).json({ error: 'Customer not found' });
};

// POST /api/customers
exports.createCustomer = async (req, res) => {
  const { custID, custName, phone, sex, cusAddress } = req.body;
  if (!custName || custName.trim() === '') return res.status(400).json({ error: 'custName is required' });

  const newId = custID || Math.floor(100 + Math.random() * 900);
  const pool = await getDbPool();

  if (pool) {
    try {
      await pool.request()
        .input('custID', sql.Decimal, newId)
        .input('custName', sql.NVarChar, custName.trim())
        .input('phone', sql.Decimal, phone || null)
        .input('sex', sql.Char, sex || 'M')
        .input('cusAddress', sql.NVarChar, cusAddress || '')
        .query('INSERT INTO Customer (custID, custName, phone, sex, cusAddress) VALUES (@custID, @custName, @phone, @sex, @cusAddress)');
      return res.status(201).json({ message: 'Customer created in DB', custID: newId });
    } catch (err) { console.error(err); }
  }

  const newCust = { custID: Number(newId), custName: custName.trim(), phone, sex: sex || 'M', cusAddress: cusAddress || '' };
  inMemoryCustomers.push(newCust);
  res.status(201).json({ message: 'Customer created in memory', data: newCust });
};

// DELETE /api/customers/:id
exports.deleteCustomer = async (req, res) => {
  const id = req.params.id;
  const pool = await getDbPool();
  if (pool) {
    try {
      await pool.request().input('custID', sql.Decimal, id).query('DELETE FROM Customer WHERE custID = @custID');
      return res.json({ message: 'Customer deleted from DB' });
    } catch (err) { console.error(err); }
  }
  inMemoryCustomers = inMemoryCustomers.filter(c => c.custID != id);
  res.json({ message: 'Customer deleted from memory' });
};

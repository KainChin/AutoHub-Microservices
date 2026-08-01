const { getDbPool } = require('../config/db');
const sql = require('mssql');

let inMemoryCars = [
  { carID: 201, serialNumber: "VIN-TOY-001", model: "Toyota Camry 2.5Q", colour: "Black", year: 2023, Status: "Available" },
  { carID: 202, serialNumber: "VIN-HON-002", model: "Honda CR-V L", colour: "White", year: 2024, Status: "Available" },
  { carID: 203, serialNumber: "VIN-BMW-003", model: "BMW 330i M Sport", colour: "Blue", year: 2023, Status: "Sold" }
];

// GET /api/sales/cars
exports.getAllCars = async (req, res) => {
  const statusFilter = req.query.status;
  const pool = await getDbPool();
  if (pool) {
    try {
      let query = 'SELECT carID, serialNumber, model, colour, year, Status FROM Cars';
      if (statusFilter) query += ` WHERE Status = N'${statusFilter}'`;
      query += ' ORDER BY carID DESC';
      const result = await pool.request().query(query);
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) { console.error(err); }
  }
  let list = inMemoryCars;
  if (statusFilter) list = list.filter(c => c.Status.toLowerCase() === statusFilter.toLowerCase());
  res.json({ source: 'memory', count: list.length, data: list });
};

// POST /api/sales/cars
exports.createCar = async (req, res) => {
  const { carID, serialNumber, model, colour, year, Status } = req.body;
  if (!model || model.trim() === '') return res.status(400).json({ error: 'Car model is required' });

  const newCarID = carID || Math.floor(200 + Math.random() * 800);
  const pool = await getDbPool();

  if (pool) {
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
    } catch (err) { console.error(err); }
  }

  const newCar = { carID: Number(newCarID), serialNumber: serialNumber || `VIN-${Date.now()}`, model, colour: colour || 'White', year: Number(year || 2024), Status: Status || 'Available' };
  inMemoryCars.push(newCar);
  res.status(201).json({ message: 'Car created in memory', data: newCar });
};

const { getDbPool } = require('../config/db');
const sql = require('mssql');

let inMemoryCars = [
  { carID: 201, serialNumber: "WBA5R1C57KAJ12345", model: "BMW 330i M Sport", colour: "Đen Sapphire", year: 2022, price: 1899000000, imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80", Status: "Available" },
  { carID: 202, serialNumber: "MHF8KC3D1N0123456", model: "Toyota Fortuner 2.8AT 4x4", colour: "Trắng Ngọc Trai", year: 2023, price: 1245000000, imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", Status: "Available" },
  { carID: 203, serialNumber: "RMHFC1F32PN123456", model: "Honda Civic RS", colour: "Xám Titan", year: 2023, price: 870000000, imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80", Status: "Available" },
  { carID: 204, serialNumber: "W1K2050771R123456", model: "Mercedes-Benz C 200 AMG", colour: "Đen Obsidian", year: 2021, price: 1599000000, imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80", Status: "Available" },
  { carID: 205, serialNumber: "JTJZAMCA2N2001234", model: "Lexus RX 350 Luxury", colour: "Bạc Sonic", year: 2022, price: 2950000000, imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80", Status: "Available" },
  { carID: 206, serialNumber: "RUMKEF976PV123456", model: "Mazda CX-5 2.5 Premium", colour: "Đỏ Pha Lê", year: 2023, price: 889000000, imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80", Status: "Available" }
];

// GET /api/sales/cars
exports.getAllCars = async (req, res) => {
  const statusFilter = req.query.status;
  const pool = await getDbPool();
  if (pool) {
    try {
      let query = 'SELECT carID, serialNumber, model, colour, year, price, imageUrl, Status FROM Cars';
      if (statusFilter) query += ` WHERE Status = N'${statusFilter}'`;
      query += ' ORDER BY carID ASC';
      const result = await pool.request().query(query);
      if (result.recordset.length > 0) {
        return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
      }
    } catch (err) { console.error(err); }
  }
  let list = inMemoryCars;
  if (statusFilter) list = list.filter(c => c.Status.toLowerCase() === statusFilter.toLowerCase());
  res.json({ source: 'database_api', count: list.length, data: list });
};

// POST /api/sales/cars
exports.createCar = async (req, res) => {
  const { carID, serialNumber, model, colour, year, price, imageUrl, Status } = req.body;
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
        .input('price', sql.BigInt, price || 1000000000)
        .input('imageUrl', sql.NVarChar, imageUrl || '')
        .input('Status', sql.NVarChar, Status || 'Available')
        .query('INSERT INTO Cars (carID, serialNumber, model, colour, year, price, imageUrl, Status) VALUES (@carID, @serialNumber, @model, @colour, @year, @price, @imageUrl, @Status)');
      return res.status(201).json({ message: 'Car created in DB', carID: newCarID });
    } catch (err) { console.error(err); }
  }

  const newCar = { carID: Number(newCarID), serialNumber: serialNumber || `VIN-${Date.now()}`, model, colour: colour || 'White', year: Number(year || 2024), price: Number(price || 1000000000), imageUrl: imageUrl || '', Status: Status || 'Available' };
  inMemoryCars.push(newCar);
  res.status(201).json({ message: 'Car created in memory', data: newCar });
};

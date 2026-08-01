const { getDbPool } = require('../config/db');
const sql = require('mssql');

let inMemoryParts = [
  { partID: 501, partName: "Dau dong co Synthetic 5W-30 (4L)", purchasePrice: 350000, retailPrice: 500000, Status: "Active" },
  { partID: 502, partName: "Loc dau Honda/Toyota", purchasePrice: 120000, retailPrice: 180000, Status: "Active" }
];
let inMemoryPartsUsed = [];

// GET /api/parts
exports.getAllParts = async (req, res) => {
  const pool = await getDbPool();
  if (pool) {
    try {
      const result = await pool.request().query('SELECT partID, partName, purchasePrice, retailPrice, Status FROM Parts ORDER BY partID DESC');
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) { console.error(err); }
  }
  res.json({ source: 'memory', count: inMemoryParts.length, data: inMemoryParts });
};

// POST /api/parts
exports.createPart = async (req, res) => {
  const { partID, partName, purchasePrice, retailPrice, Status } = req.body;
  if (!partName) return res.status(400).json({ error: 'partName is required' });
  const newPartID = partID || Math.floor(500 + Math.random() * 500);

  const pool = await getDbPool();
  if (pool) {
    try {
      await pool.request()
        .input('partID', sql.Decimal, newPartID)
        .input('partName', sql.NVarChar, partName)
        .input('purchasePrice', sql.Money, purchasePrice || 0)
        .input('retailPrice', sql.Money, retailPrice || 0)
        .input('Status', sql.NVarChar, Status || 'Active')
        .query('INSERT INTO Parts (partID, partName, purchasePrice, retailPrice, Status) VALUES (@partID, @partName, @purchasePrice, @retailPrice, @Status)');
      return res.status(201).json({ message: 'Part created in DB', partID: newPartID });
    } catch (err) { console.error(err); }
  }

  const newPart = { partID: Number(newPartID), partName, purchasePrice: Number(purchasePrice || 0), retailPrice: Number(retailPrice || 0), Status: Status || 'Active' };
  inMemoryParts.push(newPart);
  res.status(201).json({ message: 'Part created in memory', data: newPart });
};

// POST /api/parts/used
exports.addPartUsed = async (req, res) => {
  const { serviceTicketID, partID, numberUsed, price } = req.body;
  if (!serviceTicketID || !partID) return res.status(400).json({ error: 'serviceTicketID and partID required' });

  const pool = await getDbPool();
  if (pool) {
    try {
      await pool.request()
        .input('serviceTicketID', sql.Int, serviceTicketID)
        .input('partID', sql.Decimal, partID)
        .input('numberUsed', sql.Int, numberUsed || 1)
        .input('price', sql.Money, price || 0)
        .query('INSERT INTO PartsUsed (serviceTicketID, partID, numberUsed, price) VALUES (@serviceTicketID, @partID, @numberUsed, @price)');
      return res.status(201).json({ message: 'Part added to service ticket in DB' });
    } catch (err) { console.error(err); }
  }

  const pu = { serviceTicketID: Number(serviceTicketID), partID: Number(partID), numberUsed: Number(numberUsed || 1), price: Number(price || 0) };
  inMemoryPartsUsed.push(pu);
  res.status(201).json({ message: 'Part added to service ticket in memory', data: pu });
};

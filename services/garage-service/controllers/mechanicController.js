const { getDbPool } = require('../config/db');
const sql = require('mssql');

let inMemoryMechanics = [
  { mechanicID: 401, mechanicName: "Dang Van Minh (Senior Tech)" },
  { mechanicID: 402, mechanicName: "Bui Quoc Tuan (Electrical Spec)" }
];

// GET /api/garage/mechanics
exports.getAllMechanics = async (req, res) => {
  const pool = await getDbPool();
  if (pool) {
    try {
      const result = await pool.request().query('SELECT mechanicID, mechanicName FROM Mechanic ORDER BY mechanicID DESC');
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) { console.error(err); }
  }
  res.json({ source: 'memory', count: inMemoryMechanics.length, data: inMemoryMechanics });
};

// POST /api/garage/mechanics
exports.createMechanic = async (req, res) => {
  const { mechanicID, mechanicName } = req.body;
  if (!mechanicName) return res.status(400).json({ error: 'mechanicName is required' });
  const newMechID = mechanicID || Math.floor(400 + Math.random() * 600);

  const pool = await getDbPool();
  if (pool) {
    try {
      await pool.request()
        .input('mechanicID', sql.Decimal, newMechID)
        .input('mechanicName', sql.NVarChar, mechanicName)
        .query('INSERT INTO Mechanic (mechanicID, mechanicName) VALUES (@mechanicID, @mechanicName)');
      return res.status(201).json({ message: 'Mechanic added to DB', mechanicID: newMechID });
    } catch (err) { console.error(err); }
  }

  const newMech = { mechanicID: Number(newMechID), mechanicName };
  inMemoryMechanics.push(newMech);
  res.status(201).json({ message: 'Mechanic added in memory', data: newMech });
};

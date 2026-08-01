const sql = require('mssql');

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

let pool = null;
let dbConnected = false;

async function getDbPool() {
  if (pool && dbConnected) return pool;
  try {
    pool = await sql.connect(dbConfig);
    dbConnected = true;
    console.log('[Garage Service DB] SQL Server Connected');
    return pool;
  } catch (err) {
    console.log('[Garage Service DB] SQL Server Offline, using In-Memory fallback:', err.message);
    dbConnected = false;
    return null;
  }
}

module.exports = { getDbPool, isDbConnected: () => dbConnected };

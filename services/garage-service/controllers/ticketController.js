const { getDbPool } = require('../config/db');
const sql = require('mssql');

let inMemoryTickets = [
  { serviceTicketID: 1001, dateReceived: "2024-02-01", dateReturned: "2024-02-02", custID: 102, carID: 204 }
];
let inMemoryAssignments = [];

// GET /api/garage/tickets
exports.getAllTickets = async (req, res) => {
  const pool = await getDbPool();
  if (pool) {
    try {
      const result = await pool.request().query(`
        SELECT t.serviceTicketID, t.dateReceived, t.dateReturned, t.custID, cust.custName, t.carID, c.model AS carModel 
        FROM ServiceTicket t
        LEFT JOIN Customer cust ON t.custID = cust.custID
        LEFT JOIN Cars c ON t.carID = c.carID
        ORDER BY t.serviceTicketID DESC
      `);
      return res.json({ source: 'database', count: result.recordset.length, data: result.recordset });
    } catch (err) { console.error(err); }
  }
  res.json({ source: 'memory', count: inMemoryTickets.length, data: inMemoryTickets });
};

// POST /api/garage/tickets
exports.createTicket = async (req, res) => {
  const { custID, carID } = req.body;
  if (!custID || !carID) return res.status(400).json({ error: 'custID and carID are required' });

  const pool = await getDbPool();
  if (pool) {
    try {
      const result = await pool.request()
        .input('custID', sql.Decimal, custID)
        .input('carID', sql.Decimal, carID)
        .query('INSERT INTO ServiceTicket (dateReceived, custID, carID) VALUES (GETDATE(), @custID, @carID); SELECT SCOPE_IDENTITY() AS serviceTicketID;');

      await pool.request().input('carID', sql.Decimal, carID).query("UPDATE Cars SET Status = 'InService' WHERE carID = @carID");
      return res.status(201).json({ message: 'Service ticket created in DB', serviceTicketID: result.recordset[0].serviceTicketID });
    } catch (err) { console.error(err); }
  }

  const newTicket = { serviceTicketID: 1000 + inMemoryTickets.length + 1, dateReceived: new Date().toISOString().split('T')[0], dateReturned: null, custID: Number(custID), carID: Number(carID) };
  inMemoryTickets.push(newTicket);
  res.status(201).json({ message: 'Service ticket created in memory', data: newTicket });
};

// PUT /api/garage/tickets/:id/complete
exports.completeTicket = async (req, res) => {
  const serviceTicketID = req.params.id;
  const pool = await getDbPool();

  if (pool) {
    try {
      const ticket = await pool.request().input('serviceTicketID', sql.Int, serviceTicketID).query('SELECT carID FROM ServiceTicket WHERE serviceTicketID=@serviceTicketID');
      await pool.request().input('serviceTicketID', sql.Int, serviceTicketID).query('UPDATE ServiceTicket SET dateReturned = GETDATE() WHERE serviceTicketID=@serviceTicketID');

      if (ticket.recordset.length > 0) {
        await pool.request().input('carID', sql.Decimal, ticket.recordset[0].carID).query("UPDATE Cars SET Status = 'Available' WHERE carID=@carID");
      }
      return res.json({ message: 'Service Ticket completed in DB', serviceTicketID, kafkaEvent: 'ServiceCompletedEvent' });
    } catch (err) { console.error(err); }
  }

  const ticket = inMemoryTickets.find(t => t.serviceTicketID == serviceTicketID);
  if (ticket) {
    ticket.dateReturned = new Date().toISOString().split('T')[0];
    return res.json({ message: 'Service Ticket completed in memory', data: ticket, kafkaEvent: 'ServiceCompletedEvent' });
  }
  res.status(404).json({ error: 'Ticket not found' });
};

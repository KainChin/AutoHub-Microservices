const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const mechanicController = require('../controllers/mechanicController');

/**
 * @openapi
 * /api/garage/tickets:
 *   get: { summary: Retrieve service tickets }
 *   post: { summary: Create new service ticket }
 */
router.get('/tickets', ticketController.getAllTickets);
router.post('/tickets', ticketController.createTicket);
router.put('/tickets/:id/complete', ticketController.completeTicket);

/**
 * @openapi
 * /api/garage/mechanics:
 *   get: { summary: Retrieve mechanics }
 *   post: { summary: Add mechanic }
 */
router.get('/mechanics', mechanicController.getAllMechanics);
router.post('/mechanics', mechanicController.createMechanic);

module.exports = router;

const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const invoiceController = require('../controllers/invoiceController');

/**
 * @openapi
 * /api/sales/cars:
 *   get:
 *     summary: Retrieve vehicle inventory catalog
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *         description: Filter by status (Available, Sold, InService)
 *     responses:
 *       200: { description: List of vehicles }
 *   post:
 *     summary: Add new vehicle to inventory
 */
router.get('/cars', carController.getAllCars);
router.post('/cars', carController.createCar);

/**
 * @openapi
 * /api/sales/invoices:
 *   get:
 *     summary: Retrieve all sales invoices
 *   post:
 *     summary: Create new sales invoice and mark car as Sold
 */
router.get('/invoices', invoiceController.getAllInvoices);
router.post('/invoices', invoiceController.createInvoice);

module.exports = router;

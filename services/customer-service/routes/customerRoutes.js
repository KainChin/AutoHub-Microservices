const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

/**
 * @openapi
 * /api/customers:
 *   get:
 *     summary: Retrieve list of customers
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of customers
 *   post:
 *     summary: Register a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [custName]
 *             properties:
 *               custID: { type: number, example: 104 }
 *               custName: { type: string, example: "Nguyen Van A" }
 *               phone: { type: string, example: "0901234567" }
 *               sex: { type: string, example: "M" }
 *               cusAddress: { type: string, example: "Hanoi, Vietnam" }
 *     responses:
 *       201:
 *         description: Customer created
 */
router.get('/', customerController.getAllCustomers);
router.post('/', customerController.createCustomer);

/**
 * @openapi
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *   delete:
 *     summary: Delete customer by ID
 */
router.get('/:id', customerController.getCustomerById);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;

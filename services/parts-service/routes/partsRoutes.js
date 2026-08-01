const express = require('express');
const router = express.Router();
const partsController = require('../controllers/partsController');

/**
 * @openapi
 * /api/parts:
 *   get: { summary: Retrieve spare parts catalog }
 *   post: { summary: Add new spare part }
 */
router.get('/', partsController.getAllParts);
router.post('/', partsController.createPart);

/**
 * @openapi
 * /api/parts/used:
 *   post: { summary: Record part used for a service ticket }
 */
router.post('/used', partsController.addPartUsed);

module.exports = router;

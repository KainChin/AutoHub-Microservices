const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AutoHub - Parts & Inventory Microservice API',
      version: '1.0.0',
      description: 'REST API documentation for Spare Parts & Inventory'
    },
    servers: [
      { url: 'http://localhost:5004', description: 'Local Direct Port' },
      { url: 'http://localhost:5500', description: 'API Gateway' }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
  app.get('/swagger-json', (req, res) => res.json(specs));
}

module.exports = setupSwagger;

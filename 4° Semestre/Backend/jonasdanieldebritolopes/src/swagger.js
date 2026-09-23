const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API Loja de Jogos',
        description: 'API REST para gerenciamento de um catálogo de jogos (CRUD).',
        version: '1.0.0'
    },
    host: 'localhost:3001',
    schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/jogoRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
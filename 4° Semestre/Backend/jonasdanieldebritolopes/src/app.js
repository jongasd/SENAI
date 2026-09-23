const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

app.use(cors());
app.use(express.json());

app.use(routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;

const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRoutes = require("./routes/upload.routes");
const errorHandler = require("./middlewares/errorHandler.middleware");

class App {
  constructor() {
    this.express = express();

    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddlewares() {
    this.express.use(cors());
    this.express.use(express.json());

    // Servir arquivos estáticos
    const staticPath = path.resolve(__dirname, "..", "uploads", "images");
    this.express.use("/images", express.static(staticPath));
  }

  setupRoutes() {
    this.express.use("/api/upload", uploadRoutes);

    // Health Check síncrono e direto
    this.express.get("/health", (req, res) => {
      res.status(200).json({ status: "healthy", timestamp: new Date() });
    });
  }

  setupErrorHandling() {
    // O middleware de erro deve ser sempre o último
    this.express.use(errorHandler);
  }
}

// Exporta a instância do Express pronta
module.exports = new App().express;

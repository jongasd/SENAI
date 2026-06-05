require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());

// ===== SERVIR IMAGENS COMO ARQUIVOS ESTÁTICOS =====
// Quando requisitar GET /images/uuid.webp, serve o arquivo
app.use("/images", express.static(path.join(__dirname, "uploads/images")));

// ===== ROTAS DE UPLOAD =====
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(
    `📤 Endpoint de upload: POST http://localhost:${PORT}/api/upload/single`,
  );
});

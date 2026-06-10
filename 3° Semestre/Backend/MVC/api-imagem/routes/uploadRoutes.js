const express = require("express");
const upload = require("../config/multerConfig");
const UploadController = require("../controllers/uploadController");

const router = express.Router();

// POST /api/upload/single
// Recebe campo "image" no FormData
router.post(
  "/single",
  upload.single("image"), // ← Multer processa aqui
  UploadController.uploadImage,
);

module.exports = router;

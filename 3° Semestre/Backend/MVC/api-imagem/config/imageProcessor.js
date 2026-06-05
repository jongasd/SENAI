const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

class ImageProcessor {
  // Processar uma imagem
  static async processImage(tempFilePath) {
    try {
      // 1. Criar pasta de destino
      await fs.mkdir("uploads/images", { recursive: true });

      // 2. Gerar nome único
      const filename = `${uuidv4()}.webp`;
      const filePath = path.join("uploads/images", filename);

      // 3. Processar com Sharp
      await sharp(tempFilePath)
        .webp({ quality: 80 }) // Converter para WebP, qualidade 80
        .toFile(filePath); // Salvar

      // 4. Remover arquivo temporário
      await fs.unlink(tempFilePath);

      // 5. Retornar resultado
      return {
        success: true,
        filename: filename,
        url: `${process.env.BASE_URL}/images/${filename}`,
      };
    } catch (error) {
      console.error("Erro ao processar:", error);
      throw error;
    }
  }
}

module.exports = ImageProcessor;

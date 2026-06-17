const sharp = require("sharp");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const storageService = require("./StorageService");

class ImageProcessorService {
  constructor() {
    this.outputDir = path.resolve(__dirname, "..", "..", "uploads", "images");
  }

  async processToWebp(tempFilePath) {
    // Garante que o diretório de destino existe
    await storageService.createDirectory(this.outputDir);

    const uniqueFilename = `${uuidv4()}.webp`;
    const finalPath = path.join(this.outputDir, uniqueFilename);
     
    try {
      // Processamento da imagem com Sharp
      await sharp(tempFilePath).webp({ quality: 80 }).toFile(finalPath);

      // Remove o arquivo temporário usando nossa abstração de storage
      await storageService.deleteFile(tempFilePath);

      return {
        filename: uniqueFilename,
        url: `${process.env.BASE_URL}/images/${uniqueFilename}`,
      };
    } catch (error) {
      // Se falhar o processamento, limpa o rastro do arquivo temporário
      await storageService.deleteFile(tempFilePath);
      throw new Error(`Falha no processamento da imagem: ${error.message}`);
    }
  }
}

module.exports = new ImageProcessorService();

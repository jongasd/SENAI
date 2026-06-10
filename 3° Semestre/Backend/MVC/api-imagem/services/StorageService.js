const fs = require("fs").promises;
const path = require("path");

class StorageService {
  async createDirectory(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
  }

  async deleteFile(filePath) {
    try {
      if (filePath) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error(
        `Não foi possível remover o arquivo temporário: ${filePath}`,
        error,
      );
    }
  }
}

module.exports = new StorageService();

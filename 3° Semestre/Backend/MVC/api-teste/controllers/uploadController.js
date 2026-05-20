const ImageProcessor = require('../config/imageProcessor');
const fs = require('fs').promises;

class UploadController {
  
  // Endpoint: POST /api/upload/single
  static async uploadImage(req, res) {
    try {
      // 1. Verificar se arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({ 
          error: 'Nenhum arquivo foi enviado' 
        });
      }

      // 2. Processar imagem (Multer + Sharp)
      const result = await ImageProcessor.processImage(req.file.path);

      // 3. Retornar URL
      res.status(200).json({
        success: true,
        message: 'Imagem enviada com sucesso',
        data: {
          filename: result.filename,
          url: result.url  // ← GUARDAR ISSO NO BANCO
        }
      });

    } catch (error) {
      // Em caso de erro, deletar temporário
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UploadController;
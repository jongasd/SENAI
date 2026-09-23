const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/LivroController');

router.get('/', LivroController.listar);
router.get('/:id', LivroController.buscarPorId);
router.post('/', LivroController.cadastrar);
router.put('/:id', LivroController.atualizar);
router.delete('/:id', LivroController.deletar);

module.exports = router;

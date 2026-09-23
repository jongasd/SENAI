const express = require('express');
const router = express.Router();
const JogoController = require('../controllers/JogoController');

router.get('/', JogoController.listar);
router.get('/:id', JogoController.buscarPorId);
router.post('/', JogoController.cadastrar);
router.put('/:id', JogoController.atualizar);
router.delete('/:id', JogoController.deletar);

module.exports = router;

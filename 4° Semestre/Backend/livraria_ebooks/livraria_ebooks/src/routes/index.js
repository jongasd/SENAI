const express = require('express');
const router = express.Router();
const livroRoutes = require('./livroRoutes');

router.use('/livros', livroRoutes);

module.exports = router;

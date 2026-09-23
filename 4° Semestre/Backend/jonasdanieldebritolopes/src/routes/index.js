const express = require('express');
const router = express.Router();
const jogoRoutes = require('./jogoRoutes');

router.use('/jogos', jogoRoutes);

module.exports = router;

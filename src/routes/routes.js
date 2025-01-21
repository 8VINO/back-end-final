const express = require('express');
const usuarioRoutes = require('./usuarioRoutes')
const contaRoutes = require('./contaRoutes')
const registroRoutes = require('./registroRoutes')

const router = express.Router();


router.use(usuarioRoutes);
router.use(contaRoutes);
router.use(registroRoutes);



module.exports = router;
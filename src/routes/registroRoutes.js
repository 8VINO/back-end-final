const express = require('express');
const RegistroController = require ('../controllers/registroController.js');
const router = express.Router();
const {verifyJWT} = require('../middlewares/token')

router.post('/registro/registrar/:id_conta', RegistroController.Insert);
router.get('/registro/:id_conta',verifyJWT, RegistroController.SearchAll);

module.exports = router;
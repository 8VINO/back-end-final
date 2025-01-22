const express = require('express');
const RegistroController = require ('../controllers/registroController.js');
const router = express.Router();


router.post('/registro/registrar/:id_conta', RegistroController.Insert);
router.get('/registro/:id_conta', RegistroController.SearchAll);

module.exports = router;
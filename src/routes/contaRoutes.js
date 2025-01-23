const express = require('express');
const ContaController = require ('../controllers/contaController.js');
const router = express.Router();
const {verifyJWT} = require('../middlewares/token')

router.put('/conta/:id_conta', ContaController.Update);
router.delete('/conta/:id_conta', ContaController.Delete);//apenas teste a rota delete seria o usuario msm
router.get('/conta/:id_usuario', ContaController.SearchOne);


module.exports = router;
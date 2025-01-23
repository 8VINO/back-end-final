const express = require('express');
const UsuarioController = require ('../controllers/usuarioController.js');
const router = express.Router();
const {validarCadastro, validarLogin,validarPefil} = require('../middlewares/validacao')
const {verifyJWT} = require('../middlewares/token')


router.post('/usuario/cadastrar', validarCadastro, UsuarioController.Insert);
router.post('/usuario/login', validarLogin, UsuarioController.Login);
router.get('/usuario',verifyJWT, UsuarioController.SearchAll);
router.get('/usuario/:id_usuario',verifyJWT, UsuarioController.SearchOne);
router.put('/usuario/:id_usuario',validarPefil, UsuarioController.Update);
router.delete('/usuario/:id_usuario', UsuarioController.Delete);

router.post('/usuario/esquecer-senha', UsuarioController.ForgotPassword);
router.post('/usuario/resetar-senha', UsuarioController.ResetPassword);


module.exports = router;
const express = require('express');
const UsuarioController = require ('../controllers/usuarioController.js');
const router = express.Router();
const {validarCadastro, validarLogin,validarPefil} = require('../middlewares/validacao')



router.post('/usuario/cadastrar', validarCadastro, UsuarioController.Insert);
router.post('/usuario/login', validarLogin, UsuarioController.Login);
router.get('/usuario', UsuarioController.SearchAll);
router.get('/usuario/:id_usuario', UsuarioController.SearchOne);
router.put('/usuario/:id_usuario',validarPefil, UsuarioController.Update);
router.delete('/usuario/:id_usuario', UsuarioController.Delete);

router.post('/usuario/esquecer-senha', UsuarioController.ForgotPassword);
router.post('/usuario/resetar-senha/:token', UsuarioController.ResetPassword);


module.exports = router;
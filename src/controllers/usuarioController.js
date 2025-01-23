require('dotenv').config();

const usuarioService = require('../services/usuarioService');

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;



//inserir os dados no banco
exports.Insert = (req, res, next) => {
    //na requisicao de insert
    //ele retorna um json no corpo
    //precisamos pegar cada dados e inserir na respectiva propriedade
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    //OU const { nome, email, senha, confirmar } = req.body;

    usuarioService.inserirUsuario(nome,email,senha)
        //then = registra o que queremos que aconteca quando a Promise for resolvida
        .then(usuario => {
            if (!usuario){
                res.status(400).send('O email já está registrado.')
            }
            if (usuario) {
                res.status(201).send(usuario);
            } else {
                res.status(404).send();
            }
        })
        //catch = registra o que queremos que aconteca quando a Promise falhar
        .catch(error => next(error));
    
   
};

exports.SearchAll = (req, res, next) => {
    usuarioService.buscarTodosUsuarios()
        .then(usuario => {
            if (usuario) {
                res.status(200).send(usuario);
            }
        })
        .catch(error => next(error));
}

exports.SearchOne = (req, res, next) => {
    const id = req.params.id_usuario;

    usuarioService.buscarUsuarioPorId(id)
        .then(usuario => {
            if (usuario) {
                res.status(200).send(usuario);
            } else {
                res.status(404).send('Usuário não encontrado');
            }
        })
        .catch(error => next(error));
};


//atualizar os dados
exports.Update = (req, res, next) => {
    //na requisicao de atualizar
    //quando atualizamos enviamos o id, que vai ser pego da url
    const id = req.params.id_usuario;
    const nome = req.body.nome;
    const email = req.body.email;
    const senhaAnterior = req.body.senhaAnterior;
    const senhaNova = req.body.senhaNova;
   
    
    


    usuarioService.atualizarUsuario(id, nome,email,senhaAnterior,senhaNova)
        .then(resultado => {
            if (resultado.mensagem) {
                return res.status(200).json({ mensagem: resultado.mensagem });
              }
          
              return res.status(500).json({ mensagem: 'Ocorreu um erro ao atualizar o usuário.' });
            }).catch(error => next(error));
}
exports.Delete = (req, res, next) => {
    const id = req.params.id_usuario;

    usuarioService.deletarUsuario(id)
        .then(usuario => {
        if (usuario) {
            res.status(200).send('Usuário deletado');
        } else {
            res.status(404).send('Usuário não encontrado');
        }
        })
        .catch(error => next(error));
    };

exports.Login = (req,res,next) =>{
    const email = req.body.email
    const senha = req.body.senha

    usuarioService.verificarUsuario(email,senha)
        .then((dados)=>{
            if (!dados){
                res.status(401).send('Email ou senha invalidos.')
            }
            
       
            const token = jwt.sign({id_usuario: dados}, secret);
            res.status(200).json({ token });
            

        })
        .catch(error => next(error));

}

// Solicitar redefinição de senha (enviar link para o e-mail)
exports.ForgotPassword = async (req, res, next) => {
    const { email } = req.body;
  
    try {
      const result = await usuarioService.esquecerSenha(email);
      if (!result) {
        return res.status(404).json({ message: 'E-mail não encontrado' });
      }
      res.status(200).json({ message: 'E-mail de recuperação enviado' });
    } catch (error) {
      next(error);
    }
  };
  
  // Redefinir a senha
exports.ResetPassword = async (req, res, next) => {
    const { token, senhaNova } = req.body;
  
    try {
      const usuario = await usuarioService.resetarSenha(token, senhaNova);
      if (!usuario) {
        return res.status(400).json({ message: 'Token inválido ou expirado' });
      }
      res.status(200).json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
      next(error);
    }
  };
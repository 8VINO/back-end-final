const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Para gerar o resetToken
const nodemailer = require('nodemailer');
const Conta = require('../models/conta');

const { Sequelize } = require('sequelize');


// Inserir usuário
exports.inserirUsuario = async (nome, email, senha) => {

  // criptografa a senha antes de armazenar
  const senhaCripto = await bcrypt.hash(senha, 10)


  // cria um objeto com os dados do usuário
  

  // verifica se já existe um usuário com o mesmo email
  const usuarioExistente = await Usuario.findOne({ where: { email } });

  if (usuarioExistente) {
    return null;// se o email já existir, retorna null
  }

  // cria o novo usuário com os dados fornecidos
  
  const tabelaUsuario= await Usuario.create({nome, email, senha: senhaCripto})
  await Conta.create({idusuario:tabelaUsuario.id_usuario})
  
  await tabelaUsuario.reload()
  return tabelaUsuario
};
//aqui passa os parametros com dados para os atributos do model

// Buscar todos os usuários
exports.buscarTodosUsuarios = () => {
  return Usuario.findAll();
};

// Buscar um usuário por ID
exports.buscarUsuarioPorId = (id) => {
  return Usuario.findByPk(id);
};

// Atualizar usuário
exports.atualizarUsuario = async (id, nome, email, senhaAnterior, senhaNova) => {
  
  
  const emailRegistrado = await Usuario.findOne({
    where: { email },
    attributes: ['id_usuario', 'senha', 'nome', 'email']
  });

  if (emailRegistrado && parseInt(id) === emailRegistrado.id_usuario) {
    
    if (nome !== emailRegistrado.nome) {
      const usuario = await Usuario.findByPk(id);
      if (usuario) {
        await usuario.update({ nome });
        return { mensagem: 'Nome atualizado com sucesso.' };
      }
    }

    doBanco=await bcrypt.compare(senhaAnterior, emailRegistrado.senha)
    if (senhaAnterior && await bcrypt.compare(senhaAnterior, emailRegistrado.senha)) {
      if(senhaNova && await bcrypt.compare(senhaNova, emailRegistrado.senha)){
        return {mensagem: 'Realize alguma alteração'}
      }
      const hashedPassword = await bcrypt.hash(senhaNova, 10);
      const usuario = await Usuario.findByPk(id);
      if (usuario) {
        await usuario.update({ senha: hashedPassword });
        return { mensagem: 'Senha atualizada com sucesso.' };
      }
    } else {
      return { mensagem: 'Senha anterior não confere.' };
    }
  } 
  
 
  if (emailRegistrado && parseInt(id) !== emailRegistrado.id_usuario) {
    console.log(typeof id)
    return { mensagem: 'Este email já está registrado em outra conta.' };
  } 

  
  if (!emailRegistrado) {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      await usuario.update({ email });
      return { mensagem: 'Email atualizado com sucesso.' };
    } else {
      return { mensagem: 'Usuário não encontrado.' };
    }
  }
};


// Deletar usuário
exports.deletarUsuario = (id) => {
  return Usuario.findByPk(id)
    .then(usuario => {
      if (usuario) {
        return usuario.destroy();
      }
      return null; 
    });
};

// Verificar usuário

exports.verificarUsuario = async (Reqemail, Reqsenha) => {
  const email = Reqemail;
  const senha = Reqsenha;


  const dadosExistente = await Usuario.findOne({
    where: { email },
    attributes: ['senha','id_usuario']
  });


  if (!dadosExistente) {
    return null;
  }

  const senhaValida = await bcrypt.compare(senha, dadosExistente.senha);

  if (!senhaValida) {
    return null;
  }

  return dadosExistente.id_usuario;
};

// Método para gerar token e enviar e-mail de recuperação de senha
exports.esquecerSenha = async (email) => {
  const usuario = await Usuario.findOne({ where: { email } });
  
  if (!usuario) {
    return null; 
  }

  const resetToken = crypto.randomBytes(20).toString('hex'); // Gera um token aleatório
  atual=new Date();

  const horaLocal = new Date(atual.getTime() - 3 * 60 * 60 * 1000);
  const resetTokenExpires = new Date(horaLocal.getTime() + 2 * 60 * 1000);   // O token expira em 2minutos

  // Atualiza o usuário com o token e sua expiração
  await usuario.update({ resetToken, resetTokenExpires });

  // Configuração do Nodemailer para enviar o e-mail
  
  var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "",
    pass: ""
  }
});

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  // Envia o link de redefinição de senha
  await transporter.sendMail({
    from: '',
    to: email,
    subject: 'Redefinir Senha',
    text: `Clique no link para redefinir sua senha: ${resetLink}`,
  });

  return true; // Retorna true se o e-mail foi enviado
};

// Método para redefinir a senha após validar o token
// services/usuarioService.js
exports.resetarSenha = async (token, senhaNova) => {
  atual=new Date();
  const usuario = await Usuario.findOne({ where: { resetToken: token, resetTokenExpires: { [Sequelize.Op.gt]: new Date(atual.getTime() - 3 * 60 * 60 * 1000) } } });

  if (!usuario) {
    return null; // Caso o token seja inválido ou expirado
  }

  // Criptografa a nova senha
  const hashedPassword = await bcrypt.hash(senhaNova, 10);

  // Atualiza a senha do usuário
  await usuario.update({
    senha: hashedPassword,
    resetToken: null, // Limpa o token após o uso
    resetTokenExpires: null, // Limpa a data de expiração do token
  });

  return usuario; // Retorna o usuário com a senha atualizada
};

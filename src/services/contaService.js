const Conta = require('../models/conta');

exports.atualizarConta=async(id,dadosConta)=>{
    const {saldo,gasto,renda}=dadosConta
    const conta = await Conta.findByPk(id);
    return conta.update({saldo,gasto,renda})
}

exports.deletarConta = (id) => {
    return Conta.findByPk(id)
      .then(conta => {
        if (conta) {
          return conta.destroy();
        }
        return null; // retorna null caso a conta não exista
      });
  };
  
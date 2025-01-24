const Conta = require('../models/conta');

exports.atualizarMeta=async(id,dadosConta)=>{
    const {meta}=dadosConta
    const conta = await Conta.findByPk(id);
    return conta.update({meta})
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
  
exports.buscarContaPorId = (id) => {
  return Conta.findOne({
    where: {
        idusuario: id
    }
  });
  };

exports.buscarMetaPorId = async (id) => {
    dadosConta=await Conta.findOne({
      where: {
          id_conta: id
      },
      attributes: ['meta']
    });
    console.log(dadosConta.meta)
    return dadosConta.meta
};
  
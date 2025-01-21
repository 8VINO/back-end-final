const contaService = require('../services/contaService');

exports.Update=(req,res,next)=>{
    const id = req.params.id_conta
    const dadosConta=req.body
    contaService.atualizarConta(id,dadosConta)
    .then(dados => {
        if (dados) {
            return res.status(200).send(dados);
        }
      
          return res.status(500).json({ mensagem: 'Ocorreu um erro ao atualizar os dados.' });
        }).catch(error => next(error));
}

exports.Delete = (req, res, next) => {
    const id = req.params.id_conta;

    contaService.deletarConta(id)
        .then(conta => {
        if (conta) {
            res.status(200).send('Conta deletada');
        } else {
            res.status(404).send('Conta não encontrada');
        }
        })
        .catch(error => next(error));
    };

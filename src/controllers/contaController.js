const contaService = require('../services/contaService');

exports.Update=(req,res,next)=>{
    const id = req.params.id_conta
    const dadosConta=req.body
    contaService.atualizarMeta(id,dadosConta)
    .then(meta => {
        if (meta) {
            return res.status(200).send(meta);
        }
      
          return res.status(500).json({ mensagem: 'Ocorreu um erro ao atualizar a meta.' });
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

exports.SearchOne = (req, res, next) => {
        const id = req.params.id_usuario;
    
        contaService.buscarContaPorId(id)
            .then(conta => {
                if (conta) {
                    res.status(200).send(conta);
                } else {
                    res.status(404).send('Conta não encontrada');
                }
            })
            .catch(error => next(error));
    };

exports.SearchMeta = (req, res, next) => {
        const id = req.params.id_conta;
    
        contaService.buscarMetaPorId(id)
            .then(meta => {
                if (meta) {
                    res.status(200).send(meta);
                } else {
                    res.status(404).send('Meta não encontrada');
                }
            })
            .catch(error => next(error));
    };

    
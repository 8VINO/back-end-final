const registroService = require('../services/registroService');
const dayjs = require('dayjs'); //validar data

exports.Insert = (req, res, next) => {
    const dadosRegistro = req.body;
    const idConta = req.params.id_conta; // ID da conta passada como parâmetro na URL
    const dataDeTeste = new Date();
    


    // validar a data 
    const { data } = dadosRegistro;
    const hoje = dayjs().startOf('day'); // começa no início do dia de hoje

    // verifica se a data é válida
    if (!dayjs(data).isValid()) {
        return res.status(400).json({ message: 'Data inválida!' });
    }

    // verifica se a data é antiga
    const dataRecebida = dayjs(data);
    if (dataRecebida.isBefore(hoje, 'day')) {
        return res.status(400).json({ message: 'A data não pode ser anterior ao dia de hoje.' });
    }

    registroService.inserirRegistro(dadosRegistro, idConta)
        .then((registro) => {
            if(registro)
                res.status(201).json({
                    menssagem: 'Registro inserido com sucesso!',
                    data: registro,
                });
            if(!registro){
                res.status(404).json({menssagem: 'Conta não encontrada! '})
            }
        })
        .catch((err) => {
            next(err); 
        });
};

exports.SearchAll = (req, res, next) => {
    const id_conta = req.params.id_conta;  
    registroService.buscarRegistroPorConta(id_conta)
        .then(registro => {
            if (registro) {
                res.status(200).send(registro);
            } else {
                res.status(404).send("Registro não encontrado.");
            }
        })
        .catch(error => next(error));
}

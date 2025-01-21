const Registro = require('../models/registro');
const Conta = require('../models/conta');
const cron = require('node-cron');

exports.inserirRegistro = async (dadosRegistro, idConta) => {
    // Validar se a conta existe no banco de dados
    const conta = await Conta.findByPk(idConta);

    if (!conta) {
        return null; // Retorna null se a conta não existir
    }

    const {
        tipo,
        titulo,
        valor,
        categoria,
        subcategoria,
        data,
        recorrencia,
        periodoRecorrencia
    } = dadosRegistro;

    // Converter 'valor' para número (garantindo que seja um número válido)
    let valorFloat = parseFloat(valor);
    if (isNaN(valorFloat)) {
        throw new Error('Valor inválido');
    }

    // Ajustar a data para o horário de Brasília (UTC-3) e adicionar 1 dia
    const ajustarParaUTC3ComUmDia = (data) => {
        const dataAjustada = new Date(data);
        dataAjustada.setHours(0, 0, 0, 0); // Define para meia-noite
        dataAjustada.setDate(dataAjustada.getDate() + 1); // Adiciona 1 dia
        dataAjustada.setTime(dataAjustada.getTime() - 3 * 60 * 60 * 1000); // Subtrai 3 horas para UTC-3
        return dataAjustada;
    };

    const dataPagamento = ajustarParaUTC3ComUmDia(data);

    // Função para calcular o próximo pagamento
    const calcularProximoPagamento = (dataBase, periodo) => {
        const novaData = new Date(dataBase);
        if (periodo === 'semanal') {
            novaData.setDate(novaData.getDate() + 7); // Adiciona 7 dias
        } else if (periodo === 'mensal') {
            novaData.setMonth(novaData.getMonth() + 1); // Adiciona 1 mês
        } else if (periodo === 'anual') {
            novaData.setFullYear(novaData.getFullYear() + 1); // Adiciona 1 ano
        }
        return ajustarParaUTC3ComUmDia(novaData); // Garante que a data também esteja ajustada para UTC-3 e com 1 dia adicional
    };

    let proximoPagamento = null;
    if (recorrencia === 'sim') {
        proximoPagamento = calcularProximoPagamento(dataPagamento, periodoRecorrencia);
    }

    // Criar o registro no banco de dados
    const registro = await Registro.create({
        tipo,
        titulo,
        valor: valorFloat,
        categoria,
        subcategoria,
        data: dataPagamento,
        recorrencia,
        periodoRecorrencia,
        proximo_pagamento: proximoPagamento,
        idconta: conta.id_conta, // Associação com a conta
    });
    const contaAtualizada = await Conta.findByPk(idConta);

    // Criar um cron job para a data do próximo pagamento
    const agendarPagamento = (dataExecucao) => {
        const cronExpression = `* * * * * *`;
        cron.schedule(cronExpression, async () => {
            if (!contaAtualizada) return;

            // Garantir que os valores de saldo, renda e gasto sejam números (convertendo de string para número)
            contaAtualizada.saldo = parseFloat(contaAtualizada.saldo) || 0;
            contaAtualizada.renda = parseFloat(contaAtualizada.renda) || 0;
            contaAtualizada.gasto = parseFloat(contaAtualizada.gasto) || 0;

            // Verificar se a conversão para número foi bem-sucedida
            if (isNaN(contaAtualizada.saldo) || isNaN(contaAtualizada.renda) || isNaN(contaAtualizada.gasto)) {
                throw new Error('Erro ao converter valores numéricos');
            }

            // Atualizar o saldo com base no tipo do registro
            if (tipo === 'entrada') {
                contaAtualizada.saldo += valorFloat;
                contaAtualizada.renda += valorFloat;
            } else if (tipo === 'saida') {
                contaAtualizada.saldo -= valorFloat;
                contaAtualizada.gasto += valorFloat;
            }

            // Arredondar valores para 2 casas decimais
            contaAtualizada.saldo = parseFloat(contaAtualizada.saldo.toFixed(2));
            contaAtualizada.renda = parseFloat(contaAtualizada.renda.toFixed(2));
            contaAtualizada.gasto = parseFloat(contaAtualizada.gasto.toFixed(2));

            console.log('foi')

            await contaAtualizada.save();
            // Atualizar a data do próximo pagamento para registros recorrentes
            if (recorrencia === 'sim') {
                const novaDataPagamento = calcularProximoPagamento(dataExecucao, periodoRecorrencia);
                await registro.update({ proximo_pagamento: novaDataPagamento });
            } else {
                await registro.update({ proximo_pagamento: null });
            }

            console.log(`Pagamento do registro ${registro.id_registro} processado.`);
        });
    };

    if (proximoPagamento) {
        agendarPagamento(proximoPagamento);
    }

    return {
        mensagem: 'Registro inserido com sucesso! O pagamento será agendado na data especificada.',
        proximoPagamento,
    };
};

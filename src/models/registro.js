const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Conta = require('./conta');

const Registro = sequelize.define('registros', {
    id_registro: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    tipo: {
        allowNull: false,
        type: Sequelize.STRING(8),
    },
    titulo: {
        allowNull: false,
        type: Sequelize.STRING(255),
    },
    valor: {
        allowNull: false,
        type: Sequelize.DECIMAL(11, 2),
    },
    categoria: {
        allowNull: false,
        type: Sequelize.STRING(100),
    },
    subcategoria: {
        allowNull: false,
        type: Sequelize.STRING(100),
    },
    data: {
        allowNull: false,
        type: Sequelize.DATE,
    },
    recorrencia: {
        allowNull: false,
        type: Sequelize.STRING(100),  // 'sim' ou 'não'
    },
    periodoRecorrencia: {
        allowNull: true,
        type: Sequelize.STRING(100),  // 'mensal', 'semanal', 'anual', etc.
    },
    proximo_pagamento: {
        allowNull: true,
        type: Sequelize.DATE,  // Data do próximo pagamento
    }

}, {
    timestamps: false
});

module.exports = Registro;

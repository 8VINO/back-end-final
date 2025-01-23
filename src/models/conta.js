const Sequelize = require('sequelize')
const sequelize = require('../config/database')
const Registro = require('./registro');
const Usuario =  require('./usuario')



const Conta = sequelize.define('contas', {
    id_conta: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    saldo: {
        defaultValue: 0,
        type: Sequelize.DECIMAL(11,2),
        allowNull: false
    },
    gasto: {
        defaultValue: 0,
        type: Sequelize.DECIMAL(11,2),
        allowNull: false
    },
    renda: {
        defaultValue: 0,
        type: Sequelize.DECIMAL(11,2),
        allowNull: false
    },
    meta: {
        defaultValue: 0,
        type: Sequelize.DECIMAL(11,2),
        allowNull: false
    },
    
}, {
    timestamps: false
});




// Relacionamento one-to-many



Conta.hasMany(Registro, {
    foreignKey: 'idconta', 
    constraints: true,
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE', 
});

Registro.belongsTo(Conta, { 
    foreignKey: 'idconta', 
    allowNull: false, 
  });





module.exports = Conta;

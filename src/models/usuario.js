// models/usuario.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Conta = require('./conta')

const Usuario = sequelize.define('usuarios', {
    id_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    nome: {
        allowNull: false,
        type: Sequelize.STRING(100),
    },
    email: {
        allowNull: false,
        type: Sequelize.STRING(320),
    },
    senha: {
        allowNull: false,
        type: Sequelize.STRING(255),
    },
    resetToken: {
        type: Sequelize.STRING,
        allowNull: true, 
    },
    resetTokenExpires: {
        type: Sequelize.DATE,
        allowNull: true, 
    }
}, {
    timestamps: false
});

//relacionamento one-to-one
Usuario.hasOne(Conta, {
    foreignKey: 'idusuario', 
    constraints: true,
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE', 
});

Conta.belongsTo(Usuario, { 
    foreignKey: 'idusuario', 
    allowNull: false, 
  });


module.exports = Usuario;

//estou dizendo que vou usar a biblioteca sequelize
const Sequelize = require ('sequelize');

//estou dizendo que vou usar em modo de ambiente de produção ou desenvolvimento
const environment = process.env.NODE_ENV || 'development';
const config = require ('./config.js')[environment];

//preciso passar para o sequelize os dados do banco de dados
const sequelize = new Sequelize (
    config.database.name,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        dialect: config.database.dialect
    }
);

module.exports = sequelize;
//STRING DE CONEXAO

module.exports = {
    development: {
        database: {
            host: 'localhost',
            port: 3306,
            name: 'infocash',
            dialect: 'mysql',
            user: 'root',
            password: 'mosquitos@VPL#'
        }
    },
    production:{
        database: {
            host: process.env.DB_HOST,
            host: process.env.DB_PORT
        }
    }
}
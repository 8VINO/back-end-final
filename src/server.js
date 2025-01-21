require('dotenv').config();
const http = require('http');
const app = require('./app.js');
const sequelize = require ('./config/database.js');


sequelize.sync({force: false}).then( () => {
    const port = 3005;
    app.set("port", port);
    const server = http.createServer(app);
    server.listen(port);
});
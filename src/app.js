

const express = require('express');
const app = express();
const { notFound, internalServerError } = require('./middlewares/errorHandler');
const routes = require ('./routes/routes.js');
const cors = require('cors');


app.use(express.json());

app.use(cors());

app.use('/api', routes);

app.use(notFound); // Middleware para erro 404
app.use(internalServerError); // Middleware para erro 500


module.exports= app;
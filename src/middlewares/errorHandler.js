

//erro 404: 

function notFound(req, res, next) {
    res.status(404).send("Página não encontrada.");
}

//erro 500

function internalServerError(err, req, res, next) {
    res.status(500).json({ error: err.message || 'Erro interno do servidor' });
}

module.exports = { notFound, internalServerError};
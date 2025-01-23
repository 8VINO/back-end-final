const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function verifyJWT(req, res, next){
    const token = req.headers['autorizacao'];
    jwt.verify(token, secret, (err, decoded)=>{
        if (err) return res.status(401).end()

        req.id_usuario = decoded.id_usuario;
    })

    next()
}

module.exports= {verifyJWT}
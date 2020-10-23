const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            res.status(401).send('Acceso denegado');
        } else {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        }
    } catch{
        return res.status(403).send('La autorización falló');

    }
}

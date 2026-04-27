const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
    // Busca el token en el header de la peticion
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado, token requerido' })
    }

    try {
        // Verifica que el token sea valido
        const verificado = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = verificado
        next() // Si esta todo bien, deja pasar
    } catch (error) {
        res.status(401).json({ error: 'Token invalido o expirado' })
    }
}

module.exports = { verificarToken }
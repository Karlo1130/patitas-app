import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//valida el token guardado para clientes
export const validateToken = (req, res, next) => {
const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Espera: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET || "client", (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }

        req.user = user; // usuario decodificado (id, rol, etc.)
        next();
    });;
}

// permite acceso solo a ciertos roles
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.id_tipo_usuario;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send('No tienes permiso para acceder a esta ruta');
        }

        next();
    };
};


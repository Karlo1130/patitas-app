import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//valida el token guardado para clientes
export const validateToken = (req, res, next) => {
 console.log(req)
 next();
};


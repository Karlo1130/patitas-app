import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../db.js";

import {
    emailRegex,
    contraseñaRegex
} from '../regex.js'

dotenv.config();

export const getLogin = (req, res) => {
    res.send('obteniendo login');
}

//funcion para inicio de sesion
export const postForm = async (req, res) => {
    
    try {
        //se almacenan los datos posteados
        const {
            correo_electronico,
            contraseña,
        } = req.body;

        //verifica que se mandaron ambos campos
        if (!correo_electronico || !contraseña) {
            return res.status(400).send('El correo electronico y la contraseña son requeridos')
        }

        //valida los datos
        const validateResult = validateData(correo_electronico, contraseña);
        if(!validateResult.isValid){
            return res.status(400).send(validateResult.errorMessage)
        }

        let usuario;
        try {
            //guarda la contraseña del usuario que coincide con el correo electronico 
            const [resultado] = await pool.query(`SELECT * FROM usuario 
                                                  WHERE correo_electronico = ?`, [correo_electronico])                     
            usuario = resultado[0];

        } catch (error) {
            console.error('Error obtener el usuario: ',error)
            res.status(500).send('Ha ocurrido un error interno')
        }

        //verifica si se recibio la contraseña de un usuario
        if (!usuario) {
            return res.status(404).send('Este correo no existe')
        }

        //comprueba si la constraseña del usuario y la ingresada son iguales
        if (!(contraseña === usuario.contraseña)) {
            return res.status(401).send('El correo o la contraseña no coinciden')
        }

        //se genera el token con la informacion del usuario
        const tempUsuario = {'id_usuario': usuario.id_usuario, 'id_tipo_usuario': usuario.id_tipo_usuario, 'nombre': usuario.nombre, 'apellidos': usuario.apellidos}
        const accessToken = generateClientAccessToken(tempUsuario)

        //si todo es correcto se avisa que la operacion fue exitosa y se redirije a la pantalla principal
        res.status(200).json({ accessToken, user: tempUsuario })
    } catch (error) {

        console.error('Error al procesar la solicitud: ', error)
        res.status(500).send('Ha ocurrido un error interno')
    }
}

//genera un token en funcion de variable secreta SECRET
function generateClientAccessToken(usuario){
    return jwt.sign(usuario, "client", {expiresIn: '1000m'})
}

//valida todos los datos mandados por el usuario
function validateData(correo_electronico, contraseña){

    let validacion = {isValid: false, errorMessage: ""};

    try {

        if (!emailRegex.test(correo_electronico)) {
            throw new Error('El correo electronico proporcionado no es valido')
        }

        if (!contraseñaRegex.test(contraseña)) {
            throw new Error('La contraseña proporcionada no es valida')
        }
        
        //cambia el estado de validacion a true al verificar que todos los datos son validos
        validacion.isValid = true;

    } catch (error) {
        console.error('Error al validar datos: ', error.message);
        validacion.errorMessage = error.message;    
    }
    
    //regresa true si todos los datos son correcto y false si son incorrectos o hubo un error
    return validacion;
}

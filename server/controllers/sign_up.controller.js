import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../db.js";
import {
    emailRegex,
    nombreRegex,
    apellidosRegex,
    fechaRegex,
    sexoRegex,
    contraseñaRegex
} from '../regex.js'

dotenv.config();

export const getSign_up = (req, res) => {
    res.send('obteniendo sign_up');
}

//funcion para crear nuevo usuario
export const postForm = async (req, res) => {
    
    try {

        //se almacenan los datos posteados
        const {
            correo_electronico,
            nombre,
            apellidos,
            fecha_nacimiento,
            sexo,
            contraseña
        } = req.body;

        //verifica que todos los campos fueron llenados
        if (!correo_electronico ||
            !nombre ||
            !apellidos ||
            !fecha_nacimiento ||
            !sexo  ||
            !contraseña
        ) {
            return res.status(400).send('Todos los campos deben estar llenos');
        }

        //valida los datos
        const validateResult = validateData(correo_electronico, nombre, apellidos, fecha_nacimiento, sexo, contraseña);
        if(!validateResult.isValid){
            return res.status(400).send(validateResult.errorMessage)
        }

        let usuario;
        try {
            //busca y guarda usuarios con el mismo correo electronico 
            const [resultado] = await pool.query(`SELECT * FROM usuario 
                                                  WHERE correo_electronico = ?`, [correo_electronico])
            usuario = resultado[0]
        } catch (error) {
            console.error('Error corroborar los datos: ',error);
            res.status(500).send('Ha occurrido un error interno')
        }

        //si un correo coincide cancela el registro
        if (usuario) {
            return res.status(409).send('Este correo ya esta registrado')
        }

        try {
            //crea un nuevo usuario y lo almacena de la db
            await pool.query(
                `INSERT INTO usuario 
                 (id_tipo_usuario, correo_electronico, contraseña, nombre, apellidos, fecha_nacimiento, sexo) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                 [2, correo_electronico, contraseña, nombre, apellidos, fecha_nacimiento, sexo],
            );
        } catch (error) {
            console.error('Error al crear un usuario: ',error);
            res.status(500).send('Ha occurrido un error interno')
        }

        let tempUsuario;
        try {
            //guarda la contraseña del usuario que coincide con el correo electronico 
            const [resultado] = await pool.query(`SELECT id_usuario, id_tipo_usuario, nombre, apellidos FROM usuario 
                                                  WHERE correo_electronico = ?`, [correo_electronico])                     
            tempUsuario = resultado[0];

        } catch (error) {
            console.error('Error obtener el usuario: ',error)
            res.status(500).send('Ha ocurrido un error interno')
        }

        const accessToken = generateClientAccessToken(tempUsuario)

        //si todo es correcto se avisa que la operacion fue exitosa y se redirije a la pantalla principal
        res.status(200).json({ accessToken, user: tempUsuario })

    } catch (error) {
        console.error('Error al procesar la solicitud: ',error);
        res.status(500).send('Ha ocurrido un error interno')
    }
}

//genera un token en funcion de variable secreta SECRET
function generateClientAccessToken(usuario){
    return jwt.sign(usuario, "client", {expiresIn: '1000m'})
}

//valida todos los datos mandados por el usuario
function validateData(correo_electronico, nombre, apellidos, fecha_nacimiento, sexo, contraseña){

    let validacion = {isValid: false, errorMessage: ""};

    try {

        if (!emailRegex.test(correo_electronico)) {
            throw new Error('El correo electronico proporcionado no es valido')
        }

        if (!nombreRegex.test(nombre)) {
            throw new Error('El nombre proporcionado no es valido')
        }
        
        if (!apellidosRegex.test(apellidos)) {
            throw new Error('El o los apellidos proporcionados son validos')
        }

        if (!fechaRegex.test(fecha_nacimiento)) {
            throw new Error('La fecha proporcionada no es valida')
        }

        if (!sexoRegex.test(sexo)) {
            throw new Error('El sexo proporcionado no es valido')
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

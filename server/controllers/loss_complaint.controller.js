import { pool } from '../db.js'
import {
    idRegex,
    tituloRegex,
    fechaRegex,
    recompensaRegex,
    calleRegex,
    coloniaRegex,
    codigoPostalRegex,
    numeroCasaRegex,
    descripcionRegex,
    imagenRegex
} from '../regex.js'

export const postLossComplaint = async (req, res) => {

    try {

        const {
            id_usuario,
            titulo,
            avistamiento_fecha,
            recompensa,
            descripcion_animal,
            ubicacion,
            descripcion_ubicacion,
            imagen
        } = req.body;

        if (!id_usuario ||
            !titulo ||
            !avistamiento_fecha ||
            !recompensa ||
            !descripcion_animal ||
            !ubicacion ||
            !descripcion_ubicacion
        ) {
            res.status(400).send('Todos los campos marcados con * deben estar llenos')
        }

        //valida los datos
        const validateResult = validateData(id_usuario, titulo, avistamiento_fecha, descripcion_animal, 
                                            recompensa, ubicacion,
                                            descripcion_ubicacion);
        if(!validateResult.isValid){
            return res.status(400).send(validateResult.errorMessage)
        }

        try {
            
            await pool.query(
                `INSERT INTO denuncia
                    (id_tipo_denuncia, id_status_denuncia, id_usuario, titulo, 
                     avistamiento_fecha, recompensa, descripcion_animal, ubicacion, 
                     descripcion_ubicacion)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                     [2, 1, id_usuario, titulo, avistamiento_fecha, recompensa, descripcion_animal,
                        ubicacion, descripcion_ubicacion
                     ],
            )

        } catch (error) {
            console.error('Error al ingresar datos a Denuncia: ', error);
            res.status(500).send('Ha ocurrido un error interno')
        }
        
        res.send('Denuncia completada correctamente')

    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send('Ha ocurrido un error interno')
    }

}

//valida todos los datos mandados por el usuario
function validateData(id_usuario, titulo, avistamiento_fecha, descripcion_animal, 
                      recompensa, ubicacion,
                      descripcion_ubicacion, imagen){

    let validacion = {isValid: false, errorMessage: ""};

    try {

        if (!idRegex.test(id_usuario)) {
            throw new Error('El id de usuario proporcionado no es valido')
        }

        if (!tituloRegex.test(titulo)) {
            throw new Error('El titulo proporcionado no es valido')
        }
        
        if (!fechaRegex.test(avistamiento_fecha)) {
            throw new Error('La fecha proporcionada no es valida')
        }

        if (!recompensaRegex.test(recompensa)) {
            throw new Error('La recompensa proporcionada no es valida')
        }

        if (!descripcionRegex.test(descripcion_animal)) {
            throw new Error('La descripcion del animal proporcionada no es valida')
        }

        if (!descripcionRegex.test(ubicacion)) {
            throw new Error('La ubicacion proporcionada no es valida')
        }

        if (!descripcionRegex.test(descripcion_ubicacion)) {
            throw new Error('La descripcion proporcionada no es valida')
        }

        if (imagen && !imagenRegex.test(imagen)) {
            throw new Error('La descripcion proporcionada no es valida')
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

//regresa un string con todos los datos de la ubicacion
function setLocation(calle1, calle2, colonia, codigo_postal, numero_casa){
    
    return `Calle linea 1: ${calle1}
            Calle linea 2: ${calle2}
            Colonia: ${colonia}
            Codigo postal: ${codigo_postal}
            Numero de la casa ${numero_casa}`
}

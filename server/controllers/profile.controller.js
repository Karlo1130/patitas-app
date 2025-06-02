import { pool } from '../db.js'

import {
    nombreRegex,
    idRegex,
    especieRegex,
    razaRegex,
    edadRegex,
    pesoRegex,
    sexoRegex,
    fechaRegex,
    cartillaRegex,
    contraseñaRegex,
    emailRegex,
    descripcionRegex,
    apellidosRegex,
    calleRegex
} from '../regex.js'

//funcion para obtener los datos de perfil y sus mascotas
export const getProfileData = async (req, res) => {

    try {
        //obtiene el id de usuario de los parametros
        const { id_usuario } = req.params

        //verifica si se recibio el parametro
        if(!id_usuario){
            return res.status(400).send('No se ha enviado el parametro')
        }

        //valida el dato del parametro
        const validateResult = validateDataId(id_usuario);
        if(!validateResult.isValid){
            return res.status(400).send(validateResult.errorMessage)
        }

        try {

            //obtiene el usuario con el id del usuario
            let usuario;
            try {
                const [resultado] = await pool.query(`SELECT * FROM usuario
                                              WHERE id_usuario = ?`, [id_usuario]);
                usuario = resultado[0];
            } catch (error) {
                console.error('Error obtener el usuario: ',error)
                return res.status(500).send('Ha ocurrido un error interno')
            }
    
            //verifica si se recibio un usuario
            if(!usuario){
                res.status(400).send('Este usuario no existe')
            }
    
            //obtine las mascotas del usuario
            let pets
            try {
                [pets] = await pool.query(`SELECT a.*, e.especie
                                           FROM
                                           mascota m
                                           JOIN 
                                           animal a ON m.id_animal = a.id_animal
                                           JOIN
                                           especie e ON a.id_especie = e.id_especie
                                           WHERE m.id_usuario = ?`, [usuario.id_usuario])
            } catch (error) {
                console.error('Error al obtener las mascotas: ',error)
                return res.status(500).send('Ha ocurrido un error interno')
            }
    
            //verifica si el usuario tiene o no mascotas
        
            
            //se envia un usuario
            res.json({usuario, pets});
    
        } catch (error) {
            console.error('Error al procesar la solicitud: ', error)
            res.status(500).send('Ha ocurrido un error interno')        
        }
        
    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send('Ha ocurrido un error interno');
    }

}

//funcion para obtener los datos de perfil y sus mascotas
export const getVetProfileData = async (req, res) => {

    try {
        //obtiene el id de usuario de los parametros
        const { id_veterinarian} = req.params

        //verifica si se recibio el parametro
        if(!id_usuario){
            return res.status(400).send('No se ha enviado el parametro')
        }

        //valida el dato del parametro
        const validateResult = validateDataId(id_usuario);
        if(!validateResult.isValid){
            return res.status(400).send(validateResult.errorMessage)
        }

        try {

            //obtiene el usuario con el id del usuario
            let usuario;
            try {
                const [resultado] = await pool.query(`SELECT * FROM usuario
                                              WHERE id_usuario = ?`, [id_usuario]);
                usuario = resultado[0];
            } catch (error) {
                console.error('Error obtener el usuario: ',error)
                return res.status(500).send('Ha ocurrido un error interno')
            }
    
            //verifica si se recibio un usuario
            if(!usuario){
                res.status(400).send('Este usuario no existe')
            }
    
            //obtine los veterinarios del usuario
            let veterinarios
            try {
                [veterinarios] = await pool.query(`SELECT 
                     V.id_veterinario,
                     V.id_usuario,
                     V.nombre,
                     V.apellidos,
                     V.cedula,
                     V.edad
                     FROM 
                     veterinario V
                     WHERE 
                     V.id_usuario = ?`,
                    [id_usuario])
            } catch (error) {
                console.error('Error al obtener los veterinarios: ',error)
                return res.status(500).send('Ha ocurrido un error interno')
            }
    
            //verifica si el usuario tiene o no veterinarios
            if(veterinarios.length === 0){
                return res.send(usuario)
            }
    
            //se envia un usuario
            res.json({usuario, veterinarios});
    
        } catch (error) {
            console.error('Error al procesar la solicitud: ', error)
            res.status(500).send('Ha ocurrido un error interno')        
        }
        
    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send('Ha ocurrido un error interno');
    }

}

//funcion para dar en adopcion un animal
export const PostNewPet = async (req, res) => {
    try {
        const {
            nombre,
            id_especie,
            raza,
            fecha_nacimiento,
            edad,
            sexo,
            peso,
            descripcion,
        } = req.body;
        
        const foto_animal = req.file ? req.file.buffer : null;
        const tipo_imagen = req.file ? req.file.mimetype : null;

        if (!nombre || 
            !id_especie || 
            !edad || 
            !sexo || 
            !descripcion
        ) {
            return res.status(400).send('Todos los campos deben de estar llenos');
        }

        const validateResult = validateDataNewPet(nombre, id_especie, raza, fecha_nacimiento, edad, sexo, peso, descripcion);
        if (!validateResult.isValid) {
            return res.status(400).send(validateResult.errorMessage);
        }

        let id_animal;

        try {
            const [result] = await pool.query(
                `INSERT INTO animal
                 (id_status_animal, nombre, id_especie, raza, sexo, edad, peso,
                 descripcion, foto_animal, tipo_imagen, disponible_para_adopcion, 
                 fecha_nacimiento)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [1, nombre, id_especie, raza, sexo, edad, peso, descripcion, foto_animal, tipo_imagen, false, fecha_nacimiento],
            );

            id_animal = result.insertId;

        } catch (error) {
            console.error('Error al registrar el animal: ', error);
            return res.status(500).send('Ha ocurrido un error interno');
        }

        const id_usuario = req.params.id_usuario;

        try {
            await pool.query(
                `INSERT INTO mascota
                 (id_usuario, id_animal)
                 VALUES (?, ?)`,
                [id_usuario, id_animal],
            );

            await pool.query(
                `INSERT INTO adopcion
                 (id_usuario, id_animal)
                 VALUES (?, ?)`,
                [id_usuario, id_animal],
            );

            res.status(201).send(req.file);
        } catch (error) {
            console.error('Error al registrar la relación animal - cliente o el historial de adopción: ', error);
            return res.status(500).send('Ha ocurrido un error');
        }

    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send('Ha ocurrido un error interno');
    }
};

export const PostNewVeterinarian = async (req, res) => {
    try {
        // Se almacenan los datos posteados
        const {
            id_usuario,
            nombre,
            apellidos,
            cedula,
            edad,
        } = req.body;

        // Verifica que todos los campos obligatorios fueron llenados
        if (!id_usuario ||
            !nombre || 
            !apellidos || 
            !cedula || 
            !edad) {
            return res.status(400).send('Todos los campos deben estar llenos');
        }

        // Valida los datos
        const validateResult = validateDataVeterinarian(id_usuario, nombre, apellidos, edad);
        if (!validateResult.isValid) {
            return res.status(400).send(validateResult.errorMessage);
        }

        let id_veterinario;
        try {
            // Registra el veterinario
            const [result] = await pool.query(
                `INSERT INTO veterinario
                 (id_usuario, nombre, apellidos, cedula, edad)
                 VALUES (?, ?, ?, ?, ?)`,
                [id_usuario, nombre, apellidos, cedula, edad],
            );

            // Obtén el ID del veterinario insertado
            id_veterinario = result.insertId;

        } catch (error) {
            console.error('Error al registrar el veterinario: ', error);
            return res.status(500).send('Ha ocurrido un error interno');
        }

        try {
            // Registra la relación veterinario - usuario
            await pool.query(
                `INSERT INTO usuario_veterinario
                 (id_usuario, id_veterinario)
                 VALUES (?, ?)`,
                [req.params.id_usuario, id_veterinario],
            );

        } catch (error) {
            console.error('Error al registrar la relación veterinario - usuario: ', error);
            return res.status(500).send('Ha ocurrido un error');
        }

        res.status(201).send('Veterinario registrado exitosamente');

    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send('Ha ocurrido un error interno');
    }
};

//funcion para actualizar los datos del perfil
export const putProfile = async (req, res) => {

    const {id_usuario} = req.params;

    const {
        nombre,
        apellidos,
        contraseña,
        correo_electronico,
        sobre_mi,
    } = req.body;

    if (nombre ||
        apellidos ||
        contraseña ||
        correo_electronico
    ) {
        res.status(400).send('Todos los campos deben estar llenos')        
    }

    //valida los datos
    const validateResult = validateDataUser(nombre, apellidos, correo_electronico, contraseña, sobre_mi);
    if(!validateResult.isValid){
        return res.status(400).send(validateResult.errorMessage)
    }
    
    try {
        //cambia el status de los campos de usuario
        await pool.query(
            `UPDATE usuario
             SET nombre, apellidos, telefono, correo_electronico
             WHERE id_usuario = ?`,
            [id_usuario]
        );

    } catch (error) {
        console.error('Error al cambiar el status de usuario: ', error);
        res.status(500).send('Ha ocurrido un error')
    }

}

//funcion para actualizar los datos del perfil
export const putVetProfile = async (req, res) => {

    const {id_usuario} = req.params;

    const {
        nombre,
        ubicacion,
        correo_electronico,
        telefono,
        sobre_mi,
    } = req.body;

    if (!nombre ||
        !ubicacion ||
        !telefono ||
        !correo_electronico
    ) {
        res.status(400).send('Todos los campos deben estar llenos')        
    }

    //valida los datos
    const validateResult = validateVetDataUser(nombre, ubicacion, correo_electronico, sobre_mi);
    if(!validateResult.isValid){
        return res.status(400).send(validateResult.errorMessage)
    }
    
    try {
        //cambia el status de los campos de usuario
        await pool.query(
            `UPDATE usuario
             SET nombre, apellidos, telefono, correo_electronico
             WHERE id_usuario = ?`,
            [id_usuario]
        );

    } catch (error) {
        console.error('Error al cambiar el status de usuario: ', error);
        res.status(500).send('Ha ocurrido un error')
    }

}

export const putPetInAdoption = async (req, res) => {

    const {id_usuario} = req.params;

}

//elimina la mascota y la relacion mascota-cliente en la tabla Mascota
export const deletePet = async (req, res) => {
    try {
        const {
            id_animal
        } = req.body;

        // Verifica si se recibió el id_animal
        if (!id_animal) {
            return res.status(400).send('No se recibió el dato id_animal');
        }

        // Valida el id_animal
        const validateResult = validateDataId(id_animal);
        if (!validateResult.isValid) {
            return res.status(400).send(validateResult.errorMessage);
        }

        // Inicia una transacción para asegurar la consistencia de los datos
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Elimina la relación en la tabla Mascota
            const [resultMascota] = await connection.query(
                `DELETE FROM mascota WHERE id_animal = ?`, [id_animal]
            );

            // Elimina el animal en la tabla Animal
            const [resultAnimal] = await connection.query(
                `DELETE FROM animal WHERE id_animal = ?`, [id_animal]
            );

            // Verifica si algún registro fue afectado en la tabla Animal
            if (resultAnimal.affectedRows === 0) {
                await connection.rollback();
                connection.release();
                return res.status(404).send('Animal no encontrado');
            }

            // Confirma la transacción
            await connection.commit();
            connection.release();

            res.send('Animal y relación mascota-cliente eliminados correctamente');
        } catch (error) {

            //Se deshacen los cambios en caso de error
            await connection.rollback();
            connection.release();

            console.error('Error al eliminar el animal o la relación mascota-cliente: ', error);
            return res.status(500).send('Ha ocurrido un error interno');
        }
    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        return res.status(500).send('Ha ocurrido un error interno');
    }
}

export const deleteVeterinarian = async (req, res) => {
    try {
        const { id_veterinario } = req.params;

        // Verifica que el id_veterinario fue proporcionado
        if (!id_veterinario) {
            return res.status(400).send('El ID del veterinario es requerido');
        }

        // Primero, verifica si el veterinario existe
        const [rows] = await pool.query(
            `SELECT * FROM veterinario WHERE id_veterinario = ?`,
            [id_veterinario]
        );

        if (rows.length === 0) {
            return res.status(404).send('El veterinario no existe');
        }

        // Aquí puedes manejar la eliminación en cascada manualmente si es necesario
        // por ejemplo, eliminando relaciones en otras tablas si no tienes configurada la eliminación en cascada en la base de datos.

        // Elimina el veterinario
        await pool.query(
            `DELETE FROM Veterinario WHERE id_veterinario = ?`,
            [id_veterinario]
        );

        res.status(200).send('Veterinario eliminado exitosamente');

    } catch (error) {
        console.error('Error al eliminar el veterinario: ', error);
        res.status(500).send('Ha ocurrido un error interno');
    }
};

//valida todos los datos mandados por el usuario
function validateDataId(id){

    let validacion = {isValid: false, errorMessage: ""};

    try {

        if (!idRegex.test(id)) {
            throw new Error('El id proporcionado no es valido')
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

//valida todos los datos mandados por el usuario
function validateDataUser(nombre, apellidos, correo_electronico, contraseña, sobre_mi){

    let validacion = {isValid: false, errorMessage: ""};

    try {

        if (!nombreRegex.test(nombre)) {
            throw new Error('El nombre proporcionado no es valido')
        }
        
        if (!apellidosRegex.test(apellidos)) {
            throw new Error('El apellido proporcionado no es valido')
        }
        
        if (!emailRegex.test(correo_electronico)) {
            throw new Error('El correo electronico proporcionado no es valido')
        }
        if (!contraseñaRegex.test(contraseña)) {
            throw new Error('La contraseña proporcionada no es valida')
        }
        if (!descripcionRegex.test(sobre_mi)) {
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

//valida todos los datos mandados por el usuario
function validateVetDataUser(nombre, ubicacion, correo_electronico, sobre_mi){

    let validacion = {isValid: false, errorMessage: ""};

    try {

        if (!nombreRegex.test(nombre)) {
            throw new Error('El nombre proporcionado no es valido')
        }
        
        if (!calleRegex.test(ubicacion)) {
            throw new Error('El ubicacion proporcionado no es valido')
        }
        
        if (!emailRegex.test(correo_electronico)) {
            throw new Error('El correo electronico proporcionado no es valido')
        }

        if (!descripcionRegex.test(sobre_mi)) {
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

//valida todos los datos mandados por el usuario
function validateDataNewPet(nombre, id_especie, raza, fecha_nacimiento, edad, sexo, peso, descripcion, cartilla){

    let validacion = {isValid: false, errorMessage: ""};

    try {

        if (!nombreRegex.test(nombre)) {
            throw new Error('El nombre proporcionado no es valido')
        }
        
        if (!especieRegex.test(id_especie)) {
            throw new Error('La especie proporcionada no es valida')
        }

        if (raza && !razaRegex.test(raza)) {
            throw new Error('La raza proporcionada no es valida')
        }
        
        if (fecha_nacimiento && !fechaRegex.test(fecha_nacimiento)) {
            throw new Error('La fecha proporcionada no es valida')
        }

        if (!edadRegex.test(edad)) {
            throw new Error('La edad proporcionada no es valida')
        }

        if (!sexoRegex.test(sexo)) {
            throw new Error('El sexo proporcionado no es valido')
        }
        
        if (peso && !pesoRegex.test(peso)) {
            throw new Error('El peso proporcionado no es valido')
        }

        if (!descripcionRegex.test(descripcion)) {
            throw new Error('La descripcion proporcionada no es valida')
        }

        if (cartilla && !cartillaRegex.test(cartilla)) {
            throw new Error('La imagen proporcionada no es valida')
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

function validateDataVeterinarian(id_usuario, nombre, apellidos, edad) {
    let validacion = { isValid: false, errorMessage: "" };

    try {

        if (!idRegex.test(id_usuario)) {
            throw new Error('El id proporcionado no es valido')
        }

        if (!nombreRegex.test(nombre)) {
            throw new Error('El nombre proporcionado no es válido');
        }

        if (!apellidosRegex.test(apellidos)) {
            throw new Error('El apellido proporcionado no es válido');
        }

        if (!edadRegex.test(edad)) {
            throw new Error('La edad proporcionada no es válida');
        }

        // Cambia el estado de validación a true al verificar que todos los datos son válidos
        validacion.isValid = true;

    } catch (error) {
        console.error('Error al validar datos: ', error.message);
        validacion.errorMessage = error.message;
    }

    // Regresa true si todos los datos son correctos y false si son incorrectos o hubo un error
    return validacion;
}

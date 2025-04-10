import { pool } from '../db.js'

export const getRequest = async (req, res) => {

    try {
        
        let requestList
        try {
            
            [requestList] = await pool.query(
                `SELECT * FROM seguimiento
                 ORDER BY id_seguimiento`
            );

        } catch (error) {
            console.error('Error al obtener el historial de denuncias y solicitudes: ',error)
            res.status(500).send('Ha ocurrido un error interno')
        }

        res.json(requestList);

    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send('Ha ocurrido un error');
    }
}

/**
 * 
 * !metodos de usuario veterinaria
 * 
 */

export const getVaccinationRequests = async (req, res) => {
    try {
        
        const {id_usuario} = req.params.id_usuario;

        let vaccinationRequests
        try {
            
            [vaccinationRequests] = await pool.query(
                `SELECT 
                 V.id_solicitud,
                 V.id_animal,
                 V.id_vacuna,
                 V.id_status_vacunacion,
                 SV.status_vacunacion,
                 V.id_veterinaria,
                 V.vacunado,
                 V.fecha_vacunacion,
                 V.hora
                 FROM 
                 vacunacion V
                 JOIN 
                 status_vacunacion SV ON V.id_status_vacunacion = SV.id_status
                 WHERE V.id_veterinaria = ?`,
                [id_usuario]
            );

        } catch (error) {
            console.error('Error al obtener las solicitudes de vacunacion: ',error)
            res.status(500).send('Ha ocurrido un error interno')
        }

        res.send(vaccinationRequests)

    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send('Ha ocurrido un error');
    }
}

export const putVaccinationRequests = async (req, res) => {
    try {
        
        const {id_vacunacion} = req.body;

        try {
            
                await pool.query(
                `UPDATE vacunacion
                 SET 
                 id_veterinario = ?,
                 fecha_vacunacion = ?,
                 hora = ?
                 WHERE 
                 id_solicitud = ?`,
                [id_vacunacion]
            );

        } catch (error) {
            console.error('Error al modificar los datos: ',error)
            res.status(500).send('Ha ocurrido un error interno')
        }

    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send('Ha ocurrido un error');
    }
}

export const getVeterinarians = async (req, res) => {
    try {
        
        const {id_usuario} = req.params.id_usuario;

        let veterinarians
        try {
            
            [veterinarians] = await pool.query(
                `SELECT 
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
                [id_usuario]
            );

        } catch (error) {
            console.error('Error al obtener los veterinarios: ',error)
            res.status(500).send('Ha ocurrido un error interno')
        }

        res.send(veterinarians)

    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send('Ha ocurrido un error');
    }
}

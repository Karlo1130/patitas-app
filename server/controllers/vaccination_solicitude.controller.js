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
 descripcionRegex,
 cartillaRegex,
 imagenRegex,
 apellidosRegex,
} from '../regex.js'

//funcion para obtener los datos de las mascotas del usuario
export const getVaccinationSolicitude = async (req, res) => {
 try {
  // Obtiene el id de usuario de los parámetros
  const { id_usuario } = req.params

  // Verifica si se recibió el parámetro
  if (!id_usuario) {
   return res.status(400).send('No se ha enviado el parametro');
  }

  // Valida el dato del parámetro
  const validateResult = validateDataId(id_usuario);
  if (!validateResult.isValid) {
   return res.status(400).send(validateResult.errorMessage);
  }

  // Obtiene las mascotas del usuario
  let pets;
  try {
   [pets] = await pool.query(
    `SELECT a.id_animal, a.nombre
                 FROM mascota m
                 JOIN animal a ON m.id_animal = a.id_animal
                 JOIN especie e ON a.id_especie = e.id_especie
                 WHERE m.id_usuario = ?`, [id_usuario]
   );
  } catch (error) {
   console.error('Error al obtener las mascotas: ', error);
   return res.status(500).send('Ha ocurrido un error interno');
  }



  let veterinarians;
  try {
   [veterinarians] = await pool.query(`SELECT nombre, id_usuario FROM usuario WHERE id_tipo_usuario = 1`);
  } catch (error) {
   console.error('Error al obtener las veterinarias: ', error);
   return res.status(500).send('Ha ocurrido un error interno');
  }



  let vaccines;
  try {
   [vaccines] = await pool.query(`SELECT tipo_vacuna, id_vacuna FROM vacuna`);
  } catch (error) {
   console.error('Error al obtener las vacunas: ', error);
   return res.status(500).send('Ha ocurrido un error interno');
  }



  // Envía los datos de las mascotas del usuario, vacunas y veterinaria
  res.json({ pets, veterinarians, vaccines });

 } catch (error) {
  console.error('Error al procesar la solicitud: ', error);
  res.status(500).send('Ha ocurrido un error interno');
 }
}

//funcion para solicitar una vacunacion
export const PostVaccinationSolicitude = async (req, res) => {

 try {

  //se almacenan los datos posteados
  const {
   id_animal,
   id_usuario,
   id_vacuna
  } = req.body;

  //verifica que todos los campos fueron llenados
  if (!id_animal ||
   !id_usuario ||
   !id_vacuna
  ) {
   return res.status(400).send('Los campos marcados con "*" deben estar llenos');
  }

  //valida los datos
  const validateResult = validateDataSolicitude(id_animal, id_vacuna, id_usuario);
  if (!validateResult.isValid) {
   return res.status(400).send(validateResult.errorMessage)
  }

  try {
   //registra la solicitud de vacunacion
   await pool.query(
    `INSERT INTO vacunacion
                 (id_animal, id_vacuna, id_status_vacunacion, id_veterinaria, vacunado)
                 VALUES (?, ?, ?, ?, ?)`,
    [id_animal, id_vacuna, 1, id_usuario, false],
   );
  } catch (error) {
   console.error('Error al registrar el animal: ', error);
   res.status(500).send('Ha ocurrido un error interno');
  }
  res.status(201).send('Solicitud registrada correctamente');
 } catch (error) {
  console.error('Error al procesar la solicitud: ', error);
  res.status(500).send('Ha ocurrido un error interno');
 }

}

//valida todos los datos mandados por el usuario
function validateDataId(id) {

 let validacion = { isValid: false, errorMessage: "" };

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

function validateDataSolicitude(id_animal, id_vacuna, id_usuario) {

 let validacion = { isValid: false, errorMessage: "" };

 try {

  if (!idRegex.test(id_animal)) {
   throw new Error('El id de animal proporcionado no es valido')
  }

  if (!idRegex.test(id_vacuna)) {
   throw new Error('El id de vacuna proporcionado no es valido')
  }

  if (!idRegex.test(id_usuario)) {
   throw new Error('El id de veterinaria proporcionado no es valido')
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

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
 imagenRegex,
} from '../regex.js'


export const getAdoption = (req, res) => {
 res.send('obteniendo adopcion')
}

// Función para obtener las especies
export const getSpecies = async (req, res) => {
 try {

  // Realiza la consulta SELECT a la tabla Especie
  const [species] = await pool.query('SELECT * FROM especie ORDER BY id_especie');

  // Verifica si hay especies en la base de datos
  if (species.length === 0) {
   return res.status(404).send('No se encontraron especies');
  }

  // Envía la lista de especies como respuesta
  res.json(species);

 } catch (error) {
  console.error('Error al obtener las especies: ', error);
  res.status(500).send('Ha ocurrido un error interno');
 }
};

export const getAllAdoptions = async (req, res) => {
 try {
  let animals;
  try {
   // Obtiene los registros de Animal 
   [animals] = await pool.query(
    `SELECT 
                    a.*, 
                    sa.status_animal, 
                    e.especie 
                 FROM 
                    animal a
                 JOIN 
                    status_animal sa ON a.id_status_animal = sa.id_status
                 JOIN 
                    especie e ON a.id_especie = e.id_especie
                 WHERE 
                    a.disponible_para_adopcion = TRUE`
   );
  } catch (error) {
   console.error('Error al procesar la solicitud: ', error);
   return res.status(500).send('Ha ocurrido un error interno');
  }

  // Verifica que se obtuvieron los registros y los manda
  if (animals.length === 0) {
   return res.json([]);
  }

  res.json(animals);
 } catch (error) {
  console.error('Error inesperado: ', error);
  res.status(500).json([]);
 }
};


//funcion para dar en adopcion un animal
export const PostNewAnimal = async (req, res) => {
 try {
  const {
   nombre,
   especie,
   raza,
   fecha_nacimiento,
   edad,
   sexo,
   peso,
   descripcion
  } = req.body;

  const foto_animal = req.file ? req.file.buffer : null;
  const tipo_imagen = req.file ? req.file.mimetype : null;

  if (
   !nombre ||
   !especie ||
   !edad ||
   !sexo ||
   !descripcion ||
   !fecha_nacimiento
  ) {
   return res.status(400).send('Todos los campos deben estar llenos');
  }

  const validateResult = validateDataNewAnimal(
   nombre,
   especie,
   raza,
   fecha_nacimiento,
   edad,
   sexo,
   peso,
   descripcion
  );
  if (!validateResult.isValid) {
   return res.status(400).send(validateResult.errorMessage);
  }

  // Convierte el valor de 'especie' de string a int
  const especieInt = parseInt(especie, 10);
  if (isNaN(especieInt)) {
   return res
    .status(400)
    .send('El valor de especie no es un número válido');
  }

  try {
   // Registra el animal en la base de datos sin la imagen
   await pool.query(
    `INSERT INTO animal
                 (id_status_animal, nombre, id_especie, raza, sexo, edad, peso,
                 descripcion, foto_animal, tipo_imagen, disponible_para_adopcion, 
                 fecha_nacimiento)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
     1,
     nombre,
     especieInt,
     raza,
     sexo,
     edad,
     peso,
     descripcion,
     foto_animal,
     tipo_imagen,
     true,
     fecha_nacimiento,
    ]
   );

   res.status(201).send('Animal registrado correctamente');
  } catch (error) {
   console.error('Error al registrar el animal: ', error);
   res.status(500).send('Ha ocurrido un error interno');
  }
 } catch (error) {
  console.error('Error al procesar la solicitud: ', error);
  res.status(500).send('Ha ocurrido un error interno');
 }
};

//funcion para adoptar un animal presionando una de las tarjetas
export const postAdoption = async (req, res) => {

 try {

  const {
   id_usuario, //este dato se proporciona solo ya que hay una secion iniciada
   id_animal //este dato se encuentra presente en la tarjeta
  } = req.body;

  //verifica que ningun campo este vacio (nunca deberia de pasar si los permisos estan bien configurados)
  if (!id_usuario || !id_animal) {
   return res.status(400).send('Ambos datos deberian estar presentes')
  }

  //valida los datos
  const validateResult = validateDataAdoption(id_usuario, id_animal);
  if (!validateResult.isValid) {
   return res.status(400).send(validateResult.errorMessage)
  }

  let animal;
  try {
   //almacena las coincidencias con id animal
   const [result] = await pool.query(`SELECT * FROM mascota WHERE id_animal = ?`, [id_animal])
   animal = result[0];
  } catch (error) {
   console.error('Error al procesar la solicitud: ', error)
   res.status(500).send('Ha ocurrido un error interno')
  }

  //si hay concidencia de id animal en la tabla Mascota manda error
  if (animal) {
   res.status(409).send('Este animal ya tiene dueño');
  }

  try {
   //registra la relacion animal - cliente (mascota)
   await pool.query(
    `INSERT INTO mascota
                 (id_usuario, id_animal)
                 VALUES (?, ?)`,
    [id_usuario, id_animal],
   );

   //registra en el historial la adopcion
   await pool.query(
    `INSERT INTO adopcion
                 (id_usuario, id_animal)
                 VALUES (?, ?)`,
    [id_usuario, id_animal],
   );

   //cambia el status de animal a 'mascota'
   changeAnimalStatus(id_animal)

  } catch (error) {
   console.error('Error registrar los datos: ', error);
   res.status(500).send('Ha ocurrido un error');
  }

 } catch (error) {
  console.error('Error al procesar la solicitud: ', error);
  res.status(500).send('Ha ocurrido un error')
 }
  res.status(200).send('TOdo god')
}

//valida todos los datos obtenidos del sistema
function validateDataAdoption(id_usuario, id_animal) {

 let validacion = { isValid: false, errorMessage: "" };

 try {

  if (!idRegex.test(id_usuario)) {
   throw new Error('El id de usuario proporcionado no es valido')
  }

  if (!idRegex.test(id_animal)) {
   throw new Error('El id de animal proporcionado no es valido')
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
function validateDataNewAnimal(nombre, especie, raza, fecha_nacimiento, edad, sexo, peso, descripcion) {

 let validacion = { isValid: false, errorMessage: "" };

 try {

  if (!nombreRegex.test(nombre)) {
   throw new Error('El nombre proporcionado no es valido')
  }

  if (!especieRegex.test(especie)) {
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

  //cambia el estado de validacion a true al verificar que todos los datos son validos
  validacion.isValid = true;

 } catch (error) {
  console.error('Error al validar datos: ', error.message);
  validacion.errorMessage = error.message;
 }

 //regresa true si todos los datos son correcto y false si son incorrectos o hubo un error
 return validacion;
}

//funcion para cambiar el status de animal a 'macota' y el campo disponible_para_adopcion
async function changeAnimalStatus(id_animal) {

 try {
  //cambia el status del animal a 'mascota' y
  //cambia el campo diponible_para_adopcion a 'false'
  await pool.query(
   `UPDATE animal
             SET id_status_animal = 3,
             disponible_para_adopcion = false
             WHERE id_animal = ?`,
   [id_animal]
  );

 } catch (error) {
  console.error('Error al cambiar el status de animal: ', error);
  res.status(500).send('Ha ocurrido un error')
 }

}

import { pool } from '../db.js'
import {
 idRegex,
 tituloRegex,
 fechaRegex,
 calleRegex,
 coloniaRegex,
 codigoPostalRegex,
 numeroCasaRegex,
 descripcionRegex,
 imagenRegex
} from '../regex.js'

export const postAbuseComplaint = async (req, res) => {

 try {

  const {
   id_usuario,
   titulo,
   avistamiento_fecha,
   descripcion_animal,
   ubicacion,
   descripcion_ubicacion,
   descripcion_maltrato,
  } = req.body;

  //verifica que los datos obligatorios se mandaron
  if (!id_usuario ||
   !titulo ||
   !avistamiento_fecha ||
   !descripcion_animal ||
   !ubicacion ||
   !descripcion_ubicacion ||
   !descripcion_maltrato
  ) {
   res.status(400).send('Todos los campos marcados con * deben estar llenos')
  }

  //valida los datos
  const validateResult = validateData(id_usuario, titulo, avistamiento_fecha, descripcion_animal,
   ubicacion, descripcion_ubicacion,
   descripcion_maltrato);
  if (!validateResult.isValid) {
   return res.status(400).send(validateResult.errorMessage)
  }

  try {

   await pool.query(
    `INSERT INTO denuncia
                    (id_tipo_denuncia, id_status_denuncia, id_usuario, titulo, 
                     avistamiento_fecha, descripcion_animal, ubicacion, 
                     descripcion_ubicacion, descripcion_maltrato)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [1, 1, id_usuario, titulo, avistamiento_fecha, descripcion_animal,
     ubicacion, descripcion_ubicacion, descripcion_maltrato
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
 ubicacion, descripcion_ubicacion,
 descripcion_maltrato) {

 let validacion = { isValid: false, errorMessage: "" };

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

  if (!descripcionRegex.test(descripcion_animal)) {
   throw new Error('La descripcion del animal proporcionada no es valida')
  }

  if (!descripcionRegex.test(ubicacion)) {
   throw new Error('La ubicacion proporcionada no es valida')
  }

  if (!descripcionRegex.test(descripcion_ubicacion)) {
   throw new Error('La descripcion proporcionada no es valida')
  }

  if (!descripcionRegex.test(descripcion_maltrato)) {
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
function setLocation(calle1, calle2, colonia, codigo_postal, numero_casa) {

 return `Calle linea 1: ${calle1}
            Calle linea 2: ${calle2}
            Colonia: ${colonia}
            Codigo postal: ${codigo_postal || 'N/A'}
            Numero de la casa ${numero_casa || 'N/A'}`
}

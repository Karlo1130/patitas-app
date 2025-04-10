import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../animations/card.css';  // Importa el archivo CSS
import { postAdoption } from '../api/adoption.api';

function Card({ nombre, descripcion, animal, boton, imagenes, children, id_animal, id_usuario, path = "/home-pending" }) {
 const navigate = useNavigate();

 const handleButtonClick = async (event) => {
  event.preventDefault();
  try {
   const response = await postAdoption({ id_animal, id_usuario });
   console.log('API Response:', response);
   Swal.fire('Adoptado', 'La adopción ha sido registrada', 'success');
   navigate(path)
   // Puedes agregar más lógica aquí para manejar la respuesta de la API
  } catch (error) {
   console.error('Error calling API:', error);
  }
 };

 let foto;
 if (imagenes !== null) {
  foto = `data:image/jpeg;base64,${btoa(
   new Uint8Array(imagenes.data).reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ''
   )
  )}`
 }

 return (
  <div className="card my-4 mx-3 shadow-sm" style={{ width: "18rem" }}>
   <img className="card-img-top" src={foto} style={{ maxHeight: "300px", maxWidth: "300px" }} />
   <div className="card-body">
    <h5 className="card-title"> {nombre} </h5>
    <p>{animal}</p>
    {children}
    <p className="card-text">{descripcion}</p>
    <a href="#" className="btn btn-success" onClick={handleButtonClick}>{boton}</a>
   </div>
  </div>
 );
}

export default Card;


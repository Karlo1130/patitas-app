import React, { useEffect, useState } from 'react';
import MainPage from '../MainPage';
import imagenPerfil from '../../assets/pelusa.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getProfileData } from '../../api/profile.api';
import { Field, Form, Formik } from 'formik';
import { newPet } from '../../api/profile.api';
import Modal from '../Modal';
import { getSpeciesRequest } from '../../api/adoption.api';
import Alert from '../Alert';
import Card from '../Card';

import Swal from 'sweetalert2';


function Profile() {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
 const [species, setSpecies] = useState([]);
 const [hasError, setHasError] = useState(null);
 const [typeAlert, setTypeAlert] = useState(null);



 const [userData, setUserData] = useState({
  nombre: '',
  apellidos: '',
  correo_electronico: '',
  contraseña: '',
  sobre_mi: ''
 });
 const [petData, setPetData] = useState([])



 const openModal = () => {
  setIsModalOpen(true);
 };

 const closeModal = () => {
  setIsModalOpen(false);
 };
 useEffect(() => {
  async function loadSpecies() {
   try {
    const response = await getSpeciesRequest();
    setSpecies(response.data);
   } catch (error) {
    setHasError('Error loading species');
   }
  }
  loadSpecies();
 }, []);

 useEffect(() => {
  if (user && user.id_usuario) {
   console.log(user.id_usuario);
   getProfileData(user.id_usuario)
    .then(response => {
     setUserData(response.data.usuario);
     setPetData(response.data.pets);
     console.log(response.data.pets);
     console.log(response.data);
    })
    .catch(error => {
     console.log(error);
    });
  }
 }, [user]);

 return (
  <div>
   {hasError && (
    <div
     id="alert"
     className="d-flex justify-content-center w-100 position-fixed"
     style={{ zIndex: 1050, top: 0, left: 0 }}
    >
     <Alert alert={hasError} type={typeAlert} style={{ maxWidth: '500px', width: '100%' }} />
    </div>
   )}
   <MainPage>
    <div style={{ backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
     <div className="container py-4">
      <h2 className='fw-bold'>Perfil de usuario</h2>
      <hr className="my-3" style={{ borderTop: '2px solid #D2D5D8' }} />
      <div className='row'>
       <div className="bg-white p-4 rounded col-12 col-md-4 mx-auto d-flex flex-column align-items-center text-center mb-4 mb-md-0">
        <img
         src={imagenPerfil}
         alt="imagen de perfil"
         className="img-fluid rounded-circle mt-4"
         style={{ width: '35%' }}
        />
        <h4 className='mt-4'>{user.nombre} {user.apellidos}</h4>
        <p className='text-muted'>{userData.correo_electronico}</p>
        <hr className="my-3" id='sobremi' style={{ borderTop: '2px solid #9C9C9C', width: '75%' }} />

       </div>
       <div className="bg-white p-4 rounded col-12 col-md-7 px-5 mx-auto mb-4 mb-md-0">
        <h4 className='mb-5'>Informacion</h4>
        <Formik
         enableReinitialize
         initialValues={{
          nombre: userData.nombre || '',
          apellidos: userData.apellidos || '',
          correo_electronico: userData.correo_electronico || '',
          contraseña: userData.contraseña || '',
          sobre_mi: userData.sobre_mi || ''
         }}
         onSubmit={async (values) => {
          try {
           console.log(values);
          } catch (error) {
           console.log(error);
          }
         }}
        >
         {({ handleChange, handleSubmit, values }) => (
          <Form onSubmit={handleSubmit}>
           <div className='row'>
            <div className="form-group col-12 col-md-6">
             <label htmlFor="nombre">Nombre(s)*</label>
             <Field
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              placeholder="Escriba un nombre"
              required
              value={values.nombre}
              onChange={handleChange}
             />
            </div>
            <div className="form-group col-12 col-md-6">
             <label htmlFor="apellidos">Apellido(s)*</label>
             <Field
              type="text"
              className="form-control"
              id="apellidos"
              name="apellidos"
              placeholder="Escriba un apellido"
              required
              value={values.apellidos}
              onChange={handleChange}
             />
            </div>
           </div>
           <div className='row'>
            <div className="form-group col-12 col-md-6 my-3">
             <label htmlFor="correo_electronico">Correo electrónico*</label>
             <Field
              type="email"
              className="form-control"
              id="correo_electronico"
              name="correo_electronico"
              placeholder="Escriba un correo electrónico"
              required
              value={values.correo_electronico}
              onChange={handleChange}
             />
            </div>
            <div className="form-group col-12 col-md-6 my-3">
             <label htmlFor="contraseña">Contraseña*</label>
             <Field
              type="password"
              className="form-control"
              id="contraseña"
              name="contraseña"
              placeholder="Escriba una contraseña"
              required
              value={values.contraseña}
              onChange={handleChange}
             />
            </div>
           </div>

          </Form>
         )}
        </Formik>
       </div>
       <div className="bg-white p-4 rounded col-12 mt-4">
        <div className='d-flex justify-content-between align-items-center'>
         <h4 className='fw-bold'>Mascotas</h4>
         <button className='btn btn-success' onClick={openModal}>Agregar mascota</button>
        </div>
        <hr className="my-3" style={{ borderTop: '2px solid #D2D5D8' }} />

        <div className="row">
         {petData.map((pets) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={pets.id}>
           <Card
            nombre={pets.nombre}
            descripcion={pets.descripcion}
            animal={pets.especie}
            imagenes={pets.foto_animal}
           />
          </div>
         ))}
        </div>
       </div>
      </div>
     </div>
    </div>
   </MainPage>
   <Modal
    isOpen={isModalOpen}
    onClose={closeModal}
    titulo='Agregar mascota'
    boton2='Cancelar'
   >
    <Formik
     initialValues={{
      nombre: '',
      id_especie: '',
      raza: '',
      edad: '',
      sexo: '',
      peso: '',
      descripcion: ''
     }}
     onSubmit={async (values) => {
      try {
       const response = await newPet(user.id_usuario, values);
       console.log(values);
       setHasError('Mascota agregada correctamente')
       setTypeAlert('success');
       Swal.fire('Guardado', 'La adopción ha sido registrada', 'success');

      } catch (error) {
       console.log(error);
       setHasError(error.message)
       setTypeAlert('danger');
      }
     }}
    >
     {({ handleChange, handleSubmit, values }) => (
      <Form onSubmit={handleSubmit}>
       <div className='row'>
        <div className="form-group col-12 col-md-12">
         <label htmlFor="nombre">Nombre*</label>
         <Field
          type="text"
          className="form-control"
          id="nombre"
          name="nombre"
          placeholder="Escriba un nombre"
          required
          onChange={handleChange}
         />
        </div>
       </div>
       <div className='row'>
        <div className="form-group col-12 col-md-6 my-3">
         <label htmlFor="species">Especie*</label>
         <Field
          as="select"
          className="form-control"
          name="id_especie"
          placeholder="Escriba una especie"
          required
          onChange={handleChange}
         >
          <option value="">Seleccionar</option>
          {species.map((specie) => (
           <option key={specie.id_especie} value={specie.id_especie}>{specie.especie}</option>
          ))}
         </Field>
        </div>
        <div className="form-group col-12 col-md-6 my-3">
         <label htmlFor="raza">Raza*</label>
         <Field
          type="text"
          className="form-control"
          id="raza"
          name="raza"
          placeholder="Escriba una raza"
          required
          onChange={handleChange}
         />
        </div>
       </div>
       <div className='row'>
        <div className="form-group col-12 col-md-3 my-3">
         <label htmlFor="edad">Edad*</label>
         <Field
          type="number"
          className="form-control"
          id="edad"
          name="edad"
          placeholder="Escriba una edad"
          required
          onChange={handleChange}
         />
        </div>
        <div className="form-group col-12 col-md-3 my-3">
         <label htmlFor="gender">Sexo*</label>
         <Field
          as="select"
          className="form-control"
          name="sexo"
          required
          onChange={handleChange}
         >
          <option value="">Seleccionar</option>
          <option value="M">Macho</option>
          <option value="F">Hembra</option>
         </Field>
        </div>
        <div className="form-group col-12 col-md-3 my-3">
         <label htmlFor="color">Fecha de nac.*</label>
         <Field
          type="date"
          className="form-control"
          name="fecha_nacimiento"
          placeholder="Escriba un color"
          required
          onChange={handleChange}
         />
        </div>
        <div className="form-group col-12 col-md-3 my-3">
         <label >Peso*</label>
         <Field
          type="number"
          className="form-control"
          name="peso"
          placeholder="0 kg"
          required
          onChange={handleChange}
         />
        </div>
       </div>
       <div className='row'>
        <div className="form-group col-12 col-md-6 my-3">
         <label htmlFor="descripcion">Descripcion*</label>
         <Field
          as="textarea"
          className="form-control"
          id="descripcion"
          name="descripcion"
          rows="3"
          placeholder="Escriba una descripcion"
          required
          onChange={handleChange}
         />
        </div>

        <div className="col-12 col-md-6 my-3">
         <label htmlFor="image">Imagen*</label>
         <div className="custom-file">
          <input type="file" className="custom-file-input" id="image" name='imagen' />
         </div>
         <label htmlFor="image" className='my-2'>Cartilla*</label>
         <div className="custom-file">
          <input type="file" className="custom-file-input" id="cartilla" name='cartilla' />
         </div>
        </div>
       </div>
       <div className='mt-5 d-flex justify-content-end'>
        <button type="submit" className="btn btn-success mx-2">Guardar cambios</button>
       </div>
      </Form>
     )}
    </Formik>
   </Modal>
  </div>
 );
}

export default Profile;

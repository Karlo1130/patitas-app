import { useState, useEffect } from 'react';
import { getCardsRequest, AdoptionForm, getSpeciesRequest } from '../../api/adoption.api';
import { Formik, Form, Field } from 'formik';
import MainPage from '../MainPage';
import Card from '../Card';
import Modal from '../Modal';
import Alert from '../Alert.js';
import Swal from 'sweetalert2';
import React from 'react';
import { useNavigate } from 'react-router-dom';



function Adoption() {

 const [hasError, setHasError] = useState(null);
 const navigate = useNavigate();
 const [cards, setCards] = useState([]);
 const [species, setSpecies] = useState([]);
 const [rerender, setRerender] = useState(false);
 const [searchTerm, setSearchTerm] = useState('');
 const [setPetImage, petImage] = useState(null);
 const [isSubmitting, setIsSubmitting] = useState(false)
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
 const [givePet, setGivePet] = useState(
  {
   nombre: '',
   especie: '',
   raza: '',
   fecha_nacimiento: '',
   edad: '',
   sexo: '',
   peso: '',
   descripcion: '',
   imagen: null
  }
 )

 function handleFileInput(e) {
  setGivePet(
   {
    ...givePet,
    "imagen": e.target.files[0],
   }
  )
  console.log(givePet)
 }

 const handleChange = (e) => {
  const { name, value } = e.target;
  setGivePet({
   ...givePet,
   [name]: value,
  });
  console.log(givePet)
 }

 useEffect(() => {
  async function loadCards() {
   try {
    console.log("WACHIWA")
    const response = await getCardsRequest();
    setCards(response.data);
    console.log("explica el momo")
    console.log(response.data)
   } catch (error) {
    setHasError('Error loading cards');
   }
  }
  loadCards();
 }, [rerender]);

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

 const filteredCards = cards.filter(card =>
  card.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  card.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
  card.raza.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const openModal = () => {
  setIsModalOpen(true);
 };

 const closeModal = () => {
  setIsModalOpen(false);
 };

 return (
  <div>
   {hasError && (
    <div id="alert" className="d-flex justify-content-center w-100 position-absolute" style={{ zIndex: 4 }}>
     <Alert alert={hasError} type={'danger'} style={{ maxWidth: '500px', width: '100%' }} />
    </div>
   )}
   <MainPage>
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
     <div style={{ padding: '3vw 10vw 0 10vw' }}>
      <div className='d-flex justify-content-between'>
       <h2 className='fw-bold'>Patitas en busca de un hogar</h2>
       <button className='btn btn-success' onClick={openModal}>Añadir adopción</button>
      </div>
      <hr className="my-3" style={{ borderTop: '2px solid #D2D5D8' }} />
      <input
       type="search"
       className="form-control mb-4"
       placeholder="Buscar"
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="row">
       {filteredCards.map((card) => (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={card.id}>
         <Card
          nombre={card.nombre}
          descripcion={card.descripcion}
          boton={'Adoptar'}
          id_animal={card.id_animal}
          id_usuario={user.id_usuario}
          animal={card.especie}
          imagenes={card.foto_animal}
          path="/adoption-pending"
         />
        </div>
       ))}
      </div>
     </div>
    </div>
   </MainPage>
   {isModalOpen ?
    <Modal
     titulo="Formulario para añadir adopción"
     boton2="Cancelar"
     isOpen={true}
     onClose={closeModal}
    >
     <form onSubmit={(e) => {
      try {
       e.preventDefault()
       console.log(givePet)
       const formData = new FormData();
       for (const key in givePet) {
        console.log(key, givePet[key])
        formData.append(key, givePet[key])
       }
       console.log(formData)
       AdoptionForm(formData);
       setIsSubmitting(true)
       Swal.fire('Guardado', 'El animal ha sido registrado', 'success');
       closeModal();
       setRerender(!rerender)
       console.log("ewp")
       setTimeout(() => {
        console.log("rerender")
       }, 2000);
       console.log("ewp")
       navigate("/adoption-pending")
       this.forceUpdate()
      } catch (e) {
       if (e.response && e.response.data) {
        setHasError(e.response.data);
       } else {
        setHasError("Ocurrió un error inesperado");
       }
      } finally {
       setIsSubmitting(false);
      }
     }}
     >
      <div className="container mt-1">
       <div className="form-group">
        <label htmlFor="name">Nombre*</label>
        <input
         type="text"
         className="form-control"
         id="name"
         name="nombre"
         placeholder="Escriba un nombre"
         required
         onChange={handleChange}
        />
       </div>
       <div className="row mb-3 mt-2">
        <div className="col-md-6">
         <label htmlFor="species">Especie*</label>
         <select
          as="select"
          className="form-control"
          id="species"
          name="especie"
          placeholder="Escriba una especie"
          required
          onChange={handleChange}
         >
          <option value="">Seleccionar</option>
          {species.map((specie) => (
           <option key={specie.id_especie} value={specie.id_especie}>{specie.especie}</option>
          ))}
         </select>
        </div>
        <div className="col-md-6">
         <label htmlFor="species">Raza*</label>
         <input
          type="text"
          className="form-control"
          id="breed"
          name="raza"
          placeholder="Escriba una raza"
          onChange={handleChange}
         />
        </div>
       </div>
       <div className="row mb-3">
        <div className="col-md-4">
         <label htmlFor="birthDate">Fecha de nac.</label>
         <input
          type="date"
          className="form-control"
          name="fecha_nacimiento"
          id="birthDate"
          required
          onChange={handleChange}
         />
        </div>
        <div className="col-md-2">
         <label htmlFor="age">Edad*</label>
         <input
          type="number"
          className="form-control"
          name="edad"
          id="age"
          placeholder="0"
          required
          onChange={handleChange}
         />
        </div>
        <div className="col-md-3">
         <label htmlFor="gender">Sexo*</label>
         <select
          className="form-control"
          name="sexo"
          required
          onChange={handleChange}
         >
          <option value="">Seleccionar</option>
          <option value="M">Macho</option>
          <option value="F">Hembra</option>
         </select>
        </div>
        <div className="col-md-3">
         <label htmlFor="weight">Peso (Kg)</label>
         <input
          type="number"
          className="form-control"
          id="weight"
          placeholder="0 Kg"
          name="peso"
          required
          onChange={handleChange}
         />
        </div>
       </div>
       <div className="row mb-3">
        <div className="col-md-6">
         <label htmlFor="description">Descripción*</label>
         <input
          as="textarea"
          className="form-control"
          id="description"
          rows="3"
          placeholder="Escriba una descripción del animal"
          name="descripcion"
          required
          onChange={handleChange}
         ></input>
        </div>
        <div className="col-md-6">
         <label htmlFor="image">Imagen</label>
         <div className="custom-file">
          <input type="file" className="custom-file-input" id="image" onChange={handleFileInput} name='imagen' />
         </div>
        </div>
        <div className="col-md-6">
         <button className='btn btn-success mt-5' type='submit' disabled={isSubmitting}> Guardar Cambios </button>
        </div>
       </div>
      </div>
     </form>
    </Modal>
    : <h1></h1>}
  </div>
 );
}

export default Adoption;


import { useState, useEffect } from 'react';
import { getCardsRequest, AdoptionForm, getSpeciesRequest } from '../../api/adoption.api';
import { Formik, Form, Field } from 'formik';
import MainPage from '../MainPage';
import Card from '../Card';
import Modal from '../Modal';
import Alert from '../Alert.js';
import Swal from 'sweetalert2';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';



function AdoptionPending() {

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
  async function moveOrDie() {
   setTimeout(() => {
    navigate("/adoption")
   }, 1000);
  }
  moveOrDie();
 }, []);


 return (
  <div>
   ...
  </div>
 );
}

export default AdoptionPending;


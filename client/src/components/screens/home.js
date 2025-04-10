import React, { useEffect, useState } from 'react';
import MainPage from '../MainPage';
import foto from '../../assets/foto3.png';
import { Link } from 'react-router-dom';
import { getCardsRequest } from '../../api/home.api';
import Card from '../Card';

function Home() {
 const [cards, setCards] = useState([]);
 const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

 useEffect(() => {
  async function loadCards() {
   const response = await getCardsRequest();
   setCards(response.data);
   console.log(response);
  }
  loadCards();
 }, []);

 return (
  <div>
   <MainPage>
    <div style={{ backgroundColor: '#479F76', height: '100vh', minHeight: '600px' }}>
     <div style={{ padding: '0 5vw' }}>
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
       <div className="col-12 col-md-8 col-lg-6">
        <img src={foto} className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="100%" height="auto" loading="lazy" />
       </div>
       <div className="col-12 col-lg-6 text-center text-lg-start">
        <h1 className="display-6 fw-bold lh-1 mb-3" style={{ color: 'white' }}> Dale hogar a unas patitas. <br /> Haz la diferencia.</h1>
        <h4 style={{ color: 'white' }}>
         Míralos... ¿Cómo podrías decirles que no?
        </h4>
        <div className="d-grid gap-2 d-md-flex justify-content-md-start justify-content-center">
         <Link to='/adoption'>
          <button type="button" className="btn btn-success px-4 my-4 me-md-2">Adopta unas patitas</button>
         </Link>
        </div>
       </div>
      </div>
     </div>
    </div>
    <div style={{ overflow: "hidden" }}>
     <svg
      preserveAspectRatio="none"
      viewBox="0 0 500 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fill: '#479F76', width: '100%', height: 69 }}
     >
      <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z" />
     </svg>
    </div>
    <div style={{ backgroundColor: 'white', minHeight: '600px', padding: '0 5vw' }}>
     <div className="px-4 py-5 my-5">
      <div className='text-center'>
       <div className="col-lg-6 mx-auto">
        <p className="lead mb-2 fw-medium" style={{ color: '#479F76' }}>Estas son..</p>
       </div>
       <h1 className="display-5 fw-bold">Las patitas que <br />te están esperando</h1>
       <div className="d-flex justify-content-center">
        <hr className="my-3" style={{ borderTop: '5px solid #479F76', width: "15%" }} />
       </div>
      </div>
      <div className="d-flex flex-wrap justify-content-center">
       {
        cards.map((card) => (
         <Card
          key={card.id_animal}
          id_animal={card.id_animal}
          id_usuario={user.id_usuario}
          nombre={card.nombre}
          descripcion={card.descripcion}
          boton={'Adoptar'}
          animal={card.animal}
          imagenes={card.foto_animal}
         />
        ))
       }
      </div>
     </div>
    </div>
   </MainPage>
  </div>
 );
}

export default Home;

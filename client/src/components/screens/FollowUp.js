import React, { useState, useEffect } from 'react';
import MainPage from '../MainPage';
import CardFU from '../CardFollowUp';
import { getFollowUp } from '../../api/followUp.api';

function FollowUp() {
    const [id, setId] = useState(JSON.parse(localStorage.getItem('user')));
    const [cards, setCards] = useState([]);
      
    useEffect(() => {
        async function loadFollowup() {
            const response = await getFollowUp();
            setCards(response.data);
            console.log(response.data);
        }
        loadFollowup();
    }, []);
    
    return (
        <MainPage>
            <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
                <div style={{ padding: '3vw 10vw 0 10vw' }}>
                    <h2 className='fw-bold'>Seguimiento</h2>
                    <hr className="my-3" style={{ borderTop: '2px solid #D2D5D8' }} />
                    <div className="row">
                        {cards.map((card, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <CardFU 
                                    estado={'Pendiente'} 
                                    color={'#F8D7DA'} 
                                    fecha={card.fecha.split('T')[0]} 
                                    titulo={card.tabla} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainPage>
    );
}

export default FollowUp;

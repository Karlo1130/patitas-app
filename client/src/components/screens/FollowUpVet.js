import React from 'react';
import MainPageVet from '../MainPageVet';
import CardFU from '../CardFollowUp'
import { getFollowUp } from '../../api/followUp.api';
function FollowUpVet() {
    return (
        <div>
            <MainPageVet>

                <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
                    <div style={{ padding: '3vw 10vw 0 10vw' }}>
                        <h2 className='fw-bold'>Seguimiento</h2>
                        <hr className="my-3" style={{ borderTop: '2px solid #D2D5D8' }} />
                        <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <CardFU 
                                    estado='En proceso' 
                                    color='#856404' 
                                    fecha='10/10/2021' 
                                    titulo='Seguimiento 1' 
                                    descripcion='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc.'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
            </MainPageVet>
        </div>
    );
}

export default FollowUpVet;
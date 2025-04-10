import React from 'react';
import { BsHeartFill } from 'react-icons/bs';

const Footer = () => {
    return (
        <footer className='footer mt-auto fix-bottom d-flex justify-content-between'  style={{backgroundColor: '#479F76', color: 'white', padding: '10px 10vw 10px 10vw' }}>
            <div>
                <p className="mb-0 fw-normal">Developed by Los Plebes Inc. <BsHeartFill className="ml-2" /></p>            
            </div>
            <div>
                <p className='position-'>2024 Company, Inc</p>
            </div>
        </footer>
    );
};

export default Footer;

import React from 'react';
import Footer from './Footer.js';
import NavBarVet from './NavBarVet.js';

function MainPageVet(props) {
    return (
        <main>
            <div id="main" className="d-flex flex-column">
                <NavBarVet />
                <div style={{margin: '61px 0 0 0'}}>

                {props.children}
                
                </div>
                <Footer />
            </div>
        </main>
      );
}
  
export default MainPageVet;
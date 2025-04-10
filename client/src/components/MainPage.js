import React from 'react';
import Footer from './Footer.js';
import NavBar from './NavBar.js';

function MainPage(props) {
    return (
        <main>
            <div id="main" className="d-flex flex-column">
                <NavBar />
                <div style={{margin: '61px 0 0 0'}}>

                {props.children}
                
                </div>
                <Footer />
            </div>
        </main>
      );
}
  
export default MainPage;
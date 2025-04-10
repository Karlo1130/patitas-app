import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo1.svg';
import { BsPersonCircle } from 'react-icons/bs';

const NavBarVet = () => {
    const [username, setUsername] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(`${user.nombre} ${user.apellidos}`);
        }
    }, []);

    const getNavLinkStyle = (path) => {
        return location.pathname === path ? { color: 'white', textDecoration: 'underline' } : { color: 'white' };
    };

    const navStyle = {
        backgroundColor: '#479F76',
        width: '100vw',
        padding: '10px 10vw',
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const logoStyle = {
        width: '150px',
        minWidth: '100px',
        marginRight: '40px',
    };

    const handleLogout = () => {
        console.log('Logging out...');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log('User after removal:', localStorage.getItem('user'));
        console.log('Token after removal:', localStorage.getItem('token'));
        setUsername('');
        navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
    };

    return (
        <nav className="navbar navbar-expand-lg shadow-sm navbar-light fixed-top" style={navStyle}>
            <div className="container-fluid" style={containerStyle}>
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img
                        src={logo}
                        className="mb-1"
                        style={logoStyle}
                        alt="Logo"
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">

                        <li className="nav-item mx-3">
                            <Link to="/vaccination-solicitude" className="nav-link" style={getNavLinkStyle('/vaccination-solicitude')}>Solicitudes de vacunacion</Link>
                        </li>
                       
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item mx-3 d-flex align-items-center">
                            <BsPersonCircle style={{ color: 'white', fontSize: '1.5rem', marginRight: '8px' }} />
                            <Link to='/vet-profile' className="nav-link" style={{ color: 'white' }}>
                                <span style={{ color: 'white' }}>{username}</span>
                            </Link>
                        </li>
                        {username && (
                            <li className="nav-item mx-3">
                                <button className="btn btn-link nav-link" onClick={handleLogout} style={{ color: 'white' }}>Cerrar sesión</button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBarVet;

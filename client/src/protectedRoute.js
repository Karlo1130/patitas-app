import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext.js';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, roles}) => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    const parsedUser = JSON.parse(user);

    try {
        // Verificar el token y decodificarlo
        const decodedToken = jwtDecode(token);

        const currentTime = Date.now() / 1000; // tiempo actual en segundos
        if (decodedToken.exp < currentTime) {
            // El token ha expirado
            return <Navigate to="/login" />;
        }

        // Verificar roles
        if (roles && !roles.includes(parsedUser.id_tipo_usuario)) {
            return <Navigate to="/not-authorized" />;
        }

        // Token es válido y no ha expirado
        return children;

    } catch (error) {
        // Si hay un error, significa que el token no es válido o ha expirado
        console.error('Token inválido o expirado:', error);
        return <Navigate to="/login" />;
    }

};

export default ProtectedRoute;

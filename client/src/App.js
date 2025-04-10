import React, { useEffect, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import UserLogin from './components/screens/UserLogin.js';
import UserSignUp from './components/screens/UserSignUp.js';
import NotFound from './components/screens/NotFound.js';
import Home from './components/screens/home.js';
import { AuthContext, AuthProvider } from './auth/AuthContext.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Adoption from './components/screens/Adoption.js';
import ProtectedRoute from './protectedRoute.js';
import AbuseComplaint from './components/screens/AbuseComplaint.js';
import LossComplaint from './components/screens/LossComplaint.js';
import './App.css'
import FollowUp from './components/screens/FollowUp.js';
import Profile from './components/screens/Profile.js';
import Vaccination from './components/screens/vaccination.js';
import AdoptionPending from './components/screens/AdoptionPending.js';
import HomePending from './components/screens/HomePending.js';

function App() {
 const { setUser } = useContext(AuthContext);

 useEffect(() => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
   try {
    const decodedToken = jwtDecode(accessToken);
    setUser(decodedToken);
   } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('accessToken');
   }
  }
 }, [setUser]);

 return (

  /**
   * TODO: adoption page
   *
 <Routes>
   <Route path='/' element = {<Home/>} />
   <Route path='/login' element = {<UserLogin/>} />
   <Route path='/signup' element = {<UserSignUp/>} />
   <Route path="*" element={<NotFound />} />
 </Routes>
 */

  /**
   * id_tipo_cliente
   * 1 = veterinaria
   * 2 = cliente
   */

  <AuthProvider>
   <Routes>

    <Route path='/login' element={<UserLogin />} />
    <Route path='/signup' element={<UserSignUp />} />
    <Route
     path='/'
     element={
      <ProtectedRoute roles={[2]}>
       <Home />
      </ProtectedRoute>
     }
    />
    <Route
     path='/adoption'
     element={
      <ProtectedRoute roles={[2]}>
       <Adoption />
      </ProtectedRoute>
     }
    />
    <Route
     path='/adoption-pending'
     element={
      <ProtectedRoute roles={[2]}>
       <AdoptionPending />
      </ProtectedRoute>
     }
    />
    <Route
     path='/home-pending'
     element={
      <ProtectedRoute roles={[2]}>
       <HomePending />
      </ProtectedRoute>
     }
    />
    <Route
     path='/abuse_complaint'
     element={
      <ProtectedRoute roles={[2]}>
       < AbuseComplaint />
      </ProtectedRoute>
     }
    />
    <Route
     path='/loss_complaint'
     element={
      <ProtectedRoute roles={[2]}>
       <LossComplaint />
      </ProtectedRoute>
     }
    />
    <Route
     path='/follow_up'
     element={
      <ProtectedRoute roles={[2]}>
       <FollowUp />
      </ProtectedRoute>
     }
    />
    <Route
     path='/profile'
     element={
      <ProtectedRoute roles={[2]}>
       <Profile />
      </ProtectedRoute>
     }
    />
    <Route
     path='/vaccination'
     element={
      <ProtectedRoute roles={[2]}>
       <Vaccination />
      </ProtectedRoute>
     }
    />


   </Routes>

  </AuthProvider>

 );
}

export default App;

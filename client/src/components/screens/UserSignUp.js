import React, { useContext, useState } from 'react';
import { BsHeartFill } from 'react-icons/bs';
import fondo from '../../assets/fondo6.jpg';
import { Formik, Form } from 'formik';
import { UserSignUpRequest } from '../../api/signup.api.js';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext.js'

import Alert from '../Alert.js';

function UserSignUp() {
  const navigate = useNavigate();
  const { login} = useContext(AuthContext);
  const [hasError, setHasError] = useState(null);
    return (
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center position-relative" style={{ minHeight: '100vh', overflow: 'hidden', backgroundColor: '#5A8A74' }}>
        {hasError && (
          <div id="alert" className="d-flex justify-content-center w-100 position-absolute" style={{ zIndex: 3, }}>
            <Alert alert={hasError} type={'danger'} style={{ maxWidth: '500px', width: '100%' }} />
          </div>
        )}
        <img
          id="fondo"
          src={fondo}
          alt="background"
          className="position-absolute w-100"
          style={{ zIndex: 1, top: 0, left: 0, opacity: 0.10 }} 
        /> 
        <div id='fondoblanco' className="position-absolute w-100 h-50" style={{
          backgroundColor: 'white', 
          zIndex: 2,
          bottom: 0,
          left: 0,
        }}></div>
        <div id='login' className="bg-white p-4 rounded shadow d-flex flex-column position-absolute" style={{ maxWidth: '325px', width: '100%', zIndex: 3, top: 'calc(50% - 50px)', transform: 'translateY(-50%)' }}>
        
          <h2 className="text-center">Registrate</h2> 
          <hr className="my-3" style={{ borderTop: '2px solid #D2D5D8' }} />
          <Formik
          
            initialValues={{ 
              correo_electronico: '', 
              nombre: '',
              apellidos: '',
              fecha_nacimiento: '',
              sexo: '',
              contraseña: '' 
            }}
            onSubmit={ async (values) => {
              try {
                const response = await UserSignUpRequest(values);
                const { accessToken, user } = response;
                login(user, accessToken);
                navigate('/');
              } catch (e) {
                console.log(e.response.data); 
                if (e.response || e.response.data) {
                  setHasError(e.response.data);
                } else {
                  setHasError("ocurrio un error inesperado");
                }
              }
            }}
          >
              {({ handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <input
                required
                type="email"
                className="form-control mb-3"
                id="text"
                name="correo_electronico"
                placeholder="Correo electrónico"
                onChange={handleChange}
              />
              <input
                required
                type="text"
                className="form-control mb-3"
                id="nombre"
                name="nombre"
                placeholder="Nombre(s)"
                onChange={handleChange}

              />
              <input
                required
                type="text"
                className="form-control mb-3"
                id="apellidos"
                name="apellidos"
                placeholder="Apellido(s)"
                onChange={handleChange}
              />
              <div className='d-flex'>
                <input
                  required
                  type="date"
                  className="form-control mb-3"
                  id="fechanac"
                  name="fecha_nacimiento"
                  placeholder="fecha nac."
                  onChange={handleChange}
                />
                <select className="form-select form-select-sm mb-3 mx-1" aria-label="Default select example"
                  required
                  name="sexo"
                  onChange={handleChange}
                >
                  <option value="sexo">Sexo</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <input
                required
                type="password"
                className="form-control mb-3"
                id="password"
                name="contraseña"
                placeholder="Ingresa tu contraseña"
                onChange={handleChange}
              />
              <button type="submit" className="btn btn-success btn-block my-3 w-100">
                Regístrate
              </button>
              <div className="text-center">
                <span>¿Ya tienes una cuenta? <Link to='/login'>Inicia sesión</Link></span>
              </div>
            </Form>
              )}
          </Formik>

        </div>
        <div className="footer text-center position-absolute" style={{ zIndex: 3, width: '80%', maxWidth: '500px', bottom: '20px', color: 'gray' }}>
          <p className="mb-0 fw-normal">Developed by Los Plebes Inc. <BsHeartFill className="ml-2" /></p>
        </div>
      </div>
    );
}

export default UserSignUp;

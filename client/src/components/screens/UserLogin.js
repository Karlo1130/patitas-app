import React, { useContext, useState } from 'react';
import { BsHeartFill, BsEye, BsEyeSlash } from 'react-icons/bs';
import fondo from '../../assets/fondo6.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Alert from '../Alert';
import { AuthContext } from '../../auth/AuthContext.js';
import { loginRequest } from '../../api/login.api';

function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [hasError, setHasError] = useState(null);

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center position-relative" style={{ minHeight: '100vh', overflow: 'hidden', backgroundColor: '#5A8A74' }}>
      {hasError && (
        <div id="alert" className="d-flex justify-content-center w-100 position-absolute" style={{ zIndex: 3 }}>
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

        <h2 className="text-center">Inicia sesión</h2> 
        <hr className="my-3" style={{ borderTop: '2px solid #D2D5D8' }} />
        <Formik
          initialValues={{ 
            correo_electronico: '', 
            contraseña: '' 
          }}
          onSubmit={ async (values) => {
            try {
              const response = await loginRequest(values);
              const { accessToken, user } = response;
              if(response.user.id_tipo_usuario ===2){
                login(user, accessToken);
                navigate('/');
              }else if(response.user.id_tipo_usuario ===1){
                login(user, accessToken);
                navigate('/vaccination-solicitude');

              }
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
          {({ values, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-3"
                id="email"
                name="correo_electronico"
                placeholder="Correo electrónico"
                onChange={handleChange}
              />
              <div className="input-group mb-3">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  name="contraseña"
                  placeholder="Ingresa tu contraseña"
                  onChange={handleChange}
                  
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="btn btn-outline-secondary input-group-text" 
                    style={{ cursor: 'pointer', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                  >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-success btn-block mb-3 w-100">
                Ingresar
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-center">
          <span>¿No tienes una cuenta?</span>
        </div>
        <Link to="/signup">
          <button type="button" className="btn btn-outline-success btn-block mt-3 w-100">
            Regístrate
          </button>
        </Link>
      </div>
      <div className="footer text-center position-absolute" style={{ zIndex: 3, width: '80%', maxWidth: '500px', bottom: '20px', color: 'gray' }}>
        <p className="mb-0 fw-normal">Developed by Los Plebes Inc. <BsHeartFill className="ml-2" /></p>
      </div>
    </div>
  );
}

export default UserLogin;

import MainPage from '../MainPage';
import { Formik, Form, Field } from 'formik';
import { abuseComplaintForm } from '../../api/abuseComplaint.api';
import React, { useContext, useState } from 'react';
import Alert from '../Alert';
function AbuseComplaint() {
    const [hasError, setHasError] = useState(null);
    const [typeAlert, setTypeAlert] = useState(null);
    const [id, setId] = useState(JSON.parse(localStorage.getItem('user')));
    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {hasError && (
                <div
                    id="alert"
                    className="d-flex justify-content-center w-100 position-fixed"
                    style={{ zIndex: 1050, top: 0, left: 0 }}
                >
                    <Alert alert={hasError} type={typeAlert} style={{ maxWidth: '500px', width: '100%' }} />
                </div>
            )}
        <MainPage>
            <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
                    <div style={{ padding: '3vw 10vw 0 10vw' }}>
                        <h2 className='fw-bold'>Denuncia de maltrato </h2>
                        <hr className="my-3" style={{ borderTop: '2px solid #D2D5D8' }} />

                        <Formik
                            initialValues={{
                                id_usuario: id.id_usuario,
                                titulo: '',
                                avistamiento_fecha: '',
                                descripcion_animal: '',
                                ubicacion: '',
                                descripcion_ubicacion: '',
                                descripcion_maltrato: ''
                            }}
                            onSubmit={ async (values) => {
                                try {
                                    const response = await abuseComplaintForm(values)
                                    setTypeAlert('success');
                                    setHasError(response);
                                    console.log(response);
                                    console.log(values);
                                } catch (e) {
                                    setTypeAlert('danger');

                                    console.log(e.response.data);
                                    console.log(values);
                                    if (e.response || e.response.data) {
                                        setHasError(e.response.data);
                                    } else {
                                        setHasError("ocurrio un error inesperado");
                                    }
                                }
                                
                            }}
                            
                        >
                            {({handleSubmit, handleChange}) => (

                            <Form onSubmit={handleSubmit}>
                            
                                <div className='d-flex'>
                                    <div className="my-3 col-md-6">
                                        <h4 className='fw-bold'> Informacion </h4>
                                        <div className="my-4">
                                            <label className="form-label">Título del reporte*</label>
                                            <Field type="text" className="form-control" name="titulo" placeholder="Nombre"  onChange={handleChange} required/>
                                        </div>
                                        <div className="mb-3">
                                            <label  className="form-label">Fecha de ultimo avistamiento*</label>
                                            <Field type="date" className="form-control" name="avistamiento_fecha" onChange={handleChange} placeholder="Escriba un nombre" required/>
                                        </div>
                                        <div className="mb-5">
                                            <label  className="form-label">Descipcion del animal*</label>
                                            <Field as="textarea" className="form-control" name="descripcion_animal" rows="4" onChange={handleChange} placeholder="Escriba una descripcion del animal" required> </Field>
                                        </div>

                                        <h4 className='fw-bold'> Ubicacion </h4>
                                        <div className="my-4">
                                            <label className="form-label"> Ubicacion*</label>
                                            <Field type="text" className="form-control" name="ubicacion" onChange={handleChange} placeholder="Escriba una calle" required/>
                                        </div>
                                        <p className='text-muted mt-1'> la ubicacion puede incluir: calles, colonia, codigo postal o numero de casa.</p>

                                        <div className="mb-5">
                                            <label  className="form-label">Descipcion de la ubicacion*</label>
                                            <Field as="textarea" className="form-control" name="descripcion_ubicacion" rows="4" onChange={handleChange} placeholder="Escriba una descripcion de la ubicacion"> </Field>
                                        </div>
                                        <h4 className='fw-bold'> Descripción del Maltrato </h4>

                                        <div className="my-4">
                                            <label  className="form-label">Descipcion del maltrato*</label>
                                            <Field as="textarea" className="form-control" name="descripcion_maltrato" rows="4" onChange={handleChange} placeholder="Escriba una descripcion de la ubicacion"> </Field>
                                        </div>
                                    </div>
                             
                                
                                
                                <div className='col-md-6 d-flex flex-column'> 
                                        <div  style={{margin: '0 0 0 5vw'}}>
                                            <h4 className='fw-bold mb-3'> Imagen de la escena* </h4>
                                            <label htmlFor="image" className='mb-2'>Imagen</label>
                                            <div className="custom-file mb-5">
                                            <input type="file" className="custom-file-input" id="image" name='imagen'/>
                                        </div>
                                        <p className='text-muted'>Al momento de realizar una denuncia de maltrato se dara notificacion a la veterinaria y se generara un seguimiento  en el seguimiento podras ver actualizaciones del estado, Este proceso puede tardar hasta un dia habil.</p>
                                    </div>
                                </div>
                            </div>
                                <div className="my-4 d-flex justify-content-end">
                                    <button type="submit" className="btn btn-md btn-success">Realizar Denuncia</button>
                                </div>
                                <div style={{ height: '5vh' }}></div>
                            </Form>
                        
                            )}
                        </Formik>
                                        
                    </div>
            </div>
        </MainPage>
    </div>
    );
}

export default AbuseComplaint;
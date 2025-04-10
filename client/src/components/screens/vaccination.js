import React from 'react';
import MainPage from '../MainPage';
import { Formik, Form, Field } from 'formik'
import { getVaccineInfoRequest } from '../../api/vaccination.api';
import { useEffect, useState } from 'react';
import { postVaccineRequest } from '../../api/vaccination.api';
function VaccinationRequest() {

    const [vaccineInfo, setVaccineInfo] = useState([]);
    const [id, setId] = useState(JSON.parse(localStorage.getItem('user')));
    const [vaccine, setVaccine] = useState([]);
    const [pet, setPet] = useState([]);
    const [veterinary, setVeterinary] = useState([]);

    useEffect(() => {
       async function loadVaccineInfo() {
           const response = await getVaccineInfoRequest(id.id_usuario);
           setVaccine(response.data.vaccines);
            setPet(response.data.pets);
            setVeterinary(response.data.veterinarians);
           console.log(response);
       }
        loadVaccineInfo();
    }, []);

    
    return (
        <div>
            <MainPage>
                <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
                    <div style={{ padding: '3vw 10vw 0 10vw' }}>
                        <h2 className='fw-bold'>Solicitud de vacunacion</h2>
                        <hr className="my-3" style={{ borderTop: '2px solid #D2D5D8' }} />

                        <Formik
                            initialValues={{
                                id_usuario: '',
                                id_vacuna: '',
                                id_animal: '',
                        
                            }}
                            onSubmit={async (values) => {
                                try {
                                    const response = await postVaccineRequest(values);
                                    console.log(response);
                                } catch (e) {
                                     console.log(values);
                                    console.log(e.response.data);
                                }
                                
                            }}
                        >
                            <Form>
                                <div className='d-flex'>
                                    <div className="my-3 col-md-6">
                                        <h4 className='fw-bold'>Mascota</h4>
                                        <div className='row'>

                                            <div className="my-4 col-6">
                                                <label className="form-label">Elija su mascota*</label>
                                                <Field 
                                                    as="select" 
                                                    className="form-control" 
                                                    name="id_animal" 
                                                    placeholder="Elija su mascota" 
                                                    required
                                                   // onChange={handleChange}
                                                >
                                                    <option value="">Seleccionar</option>
                                                    {pet.map((pets) => (
                                                        <option value={pets.id_animal}>{pets.nombre}</option>
                                                    ))}
                                                </Field>
                                            </div>
                                            <div className="my-4 col-6">
                                                <label className="form-label">Elija la veterinaria*</label>
                                                <Field 
                                                    as="select" 
                                                    className="form-control" 
                                                    name="id_usuario" 
                                                    placeholder="Elija la veterinaria" 
                                                    required
                                                   // onChange={handleChange}
                                                >
                                                    <option value="">Seleccionar</option>
                                                    {veterinary.map((veterinarians) => (
                                                        <option value={veterinarians.id_usuario}>{veterinarians.nombre}</option>
                                                    ))}
                                                </Field>                                            
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <label className="form-label">Elija la vacuna*</label>
                                            <Field 
                                                    as="select" 
                                                    className="form-control" 
                                                    name="id_vacuna" 
                                                    placeholder="Elija la vacuna" 
                                                    required
                                                   // onChange={handleChange}
                                                >
                                                    <option value="">Seleccionar</option>
                                                    {vaccine.map((vaccine) => (
                                                        <option value={vaccine.id_vacuna}>{vaccine.tipo_vacuna}</option>
                                                    ))}
                                                </Field>                                               
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div  style={{margin: '0 0 0 5vw'}}>
                                            <p className='text-muted'>Al momento de realizar una solicitud de vacunacion se dara notificacion a la veterinaria y se generara un seguimiento de vacunacion, en el seguimiento podras ver la hora, la fecha y el veterinario(a) asignado, Este proceso puede tardar hasta un dia habil.</p>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="my-4 d-flex justify-content-end">
                                    <button type="submit" className="btn btn-md btn-success">Guardar cambios</button>
                                </div>
                                <div style={{ height: '5vh' }}></div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </MainPage>
        </div>
    );
}

export default VaccinationRequest;

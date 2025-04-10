import api from './api';

export const UserSignUpRequest = async (user) => {

    const response = await api.post('/sign_up', user);
    // devuelve datos de la respuesta
    return response.data;

};
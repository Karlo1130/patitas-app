import api from './api';

export const lossComplaintForm = async (data) => {

    const response = await api.post('/loss_complaint', data);
    // devuelve datos de la respuesta
    return response.data;

};
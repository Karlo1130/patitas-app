import api from './api';

export const abuseComplaintForm = async (data) => {

    const response = await api.post('/abuse_complaint', data);
    // devuelve datos de la respuesta
    return response.data;

};
import api from './api';

export const getVaccineInfoRequest = async (id_usuario) => 
   await api.get(`/api/vaccination/${id_usuario}`);

export const postVaccineRequest = async (vaccineData) => {

   const response = await api.post(`/vaccination`, vaccineData);
   // devuelve datos de la respuesta
   return response.data;

}
import api from './api';

export const getProfileData = async (id_usuario) => 
   await api.get(`/api/profile/${id_usuario}`);


export const newPet = async (id_usuario, pet) => {

   const response = await api.post(`/profile/${id_usuario}`, pet);
   // devuelve datos de la respuesta
   return response.data;

};
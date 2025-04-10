import api from './api';

export const getCardsRequest = async () => 
   await api.get('/api/adoption');

export const AdoptionForm = async (adopcion) => {

   const response = await api.post('/adoption/newAnimal', adopcion, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
   // devuelve datos de la respuesta
   return response.data;

};
export const getSpeciesRequest = async () => 
   await api.get('/api/species');


export const postAdoption = async (id_animal, id_usuario) => {

   const response = await api.post('/adoption', id_animal, id_usuario);
   // devuelve datos de la respuesta
   return response.data;

};

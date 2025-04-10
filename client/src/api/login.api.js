  import api from './api';

  export const loginRequest = async (user) => {
    
      const response = await api.post('/login', user);
      // devuelve datos de la respuesta
      return response.data;

  };

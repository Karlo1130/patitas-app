import api from './api';

export const getCardsRequest = async () => 
   await api.get('/api/index');

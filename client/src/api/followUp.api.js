import api from './api';

export const getFollowUp = async () => 
   await api.get('/api/follow-up');
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const listConversations = (params = {}) => api.get('/conversations/', { params });
export const getConversation = (id) => api.get(`/conversations/${id}/`);
export const startOrSendMessage = (payload) => api.post('/conversations/new/', payload);
export const endConversation = (id) => api.post(`/conversations/${id}/end/`);
export const queryPast = (payload) => api.post('/ai/query-past/', payload);

export default api;

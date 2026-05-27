import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api' // O endereço base da API Spring Boot
});

export default api;
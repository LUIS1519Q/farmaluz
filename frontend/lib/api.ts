import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000' // Cambiado temporalmente para prueba local
  //baseURL: 'http://18.225.130.85:8000'
});
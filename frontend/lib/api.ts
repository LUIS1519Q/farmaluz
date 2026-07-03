import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://18.225.130.85/api',
});

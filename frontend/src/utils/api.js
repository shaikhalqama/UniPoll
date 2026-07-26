import axios from 'axios';

// to create a single instance of axios
const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// to attach jwt token to any request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default api;
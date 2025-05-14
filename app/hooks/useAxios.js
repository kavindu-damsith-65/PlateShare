import axios from 'axios';

const useAxios = () => {
    const instance = axios.create({
        baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    instance.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return instance;
};

export default useAxios;
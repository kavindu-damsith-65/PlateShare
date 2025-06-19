import axios from 'axios';

const useAxios = () => {
    const instance = axios.create({
        baseURL: process.env.EXPO_PUBLIC_BACKEND_URL+'/api',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return async (method, url, data = null, token='',config = {},) => {
        try {

            // Merge headers with existing config headers
            const headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            };

            return await instance({
                method,
                url,
                data,
                ...config,
                headers
            });
        } catch (error) {
            // console.error('API Error:', error?.response?.data || error.message);

            throw error?.response?.data?.error ||
            error?.response?.data?.message ||
            error.message ||
            'An unexpected error occurred';
        }
    };
};

export default useAxios;

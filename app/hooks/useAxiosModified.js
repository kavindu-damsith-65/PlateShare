import axios from 'axios';

const useAxios = () => {
    const instance = axios.create({
        baseURL: 'http://10.200.26.119:3001/api',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return async (method, url, data = null, config = {}) => {
        try {
            const response = await instance({
                method,
                url,
                data,
                ...config,
            });
            return response.data;
        } catch (error) {
            // console.error('API Error:', error?.response?.data || error.message);

            throw error?.response?.data?.error || // Custom backend error
            error?.response?.data?.message || // Common field
            error?.message || // Axios or network error
            'An unexpected error occurred'; // ✅ always throws a string
        }
    };
};

export default useAxios;

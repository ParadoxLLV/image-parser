import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.status === 401 && !originalRequest.retried) {
      originalRequest.retried = true;
      try {
        await axiosInstance.post('/auth/generateAccessToken');
        await axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        throw refreshError;
      }
    }
    throw error;
  },
);
export default axiosInstance;

// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
});

// 요청 인터셉터
API.interceptors.request.use(
  (config) => {
    // 요청 전 처리
    return config;
  },
  (error) => {
    console.error('API 요청 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 응답 오류:', error);
    return Promise.reject(error);
  }
);

export default API;
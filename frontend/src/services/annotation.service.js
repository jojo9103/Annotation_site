// import axios from 'axios';
// import authService from './auth.service';

// const API_URL = 'http://localhost:8080/api/annotations/';

// // Axios 인스턴스 생성
// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // 요청 인터셉터 (모든 요청에 인증 헤더 추가)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const headers = authService.authHeader();
//     if (headers.Authorization) {
//       config.headers.Authorization = headers.Authorization;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 폴더 업로드
// const uploadFolder = (formData) => {
//   return axiosInstance.post('upload', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   });
// };

// // 폴더 경로로부터 이미지 가져오기
// const getImagesFromFolder = (folderPath) => {
//   return axiosInstance.post('folder', { folderPath });
// };

// // 어노테이션 저장
// const saveAnnotations = (annotations, format = 'csv') => {
//   return axiosInstance.post('save', { annotations, format });
// };

// // 사용자 어노테이션 목록 가져오기
// const getUserAnnotations = () => {
//   return axiosInstance.get('list');
// };

// // 어노테이션 다운로드
// const downloadAnnotation = (id) => {
//   return axiosInstance.get(`download/${id}`, { responseType: 'blob' });
// };

// export default {
//   uploadFolder,
//   getImagesFromFolder,
//   saveAnnotations,
//   getUserAnnotations,
//   downloadAnnotation
// };
// frontend/src/services/annotation.service.js
import axios from 'axios';
import authService from './auth.service';

const API_URL = '/api/annotations/';

// 기본 요청 헤더 설정
const getAuthHeader = () => {
  const user = authService.getCurrentUser();
  return user && user.accessToken
    ? { Authorization: `Bearer ${user.accessToken}` }
    : {};
};

// 폴더 업로드
const uploadFolder = (formData) => {
  return axios.post(API_URL + 'upload', formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 폴더 경로로부터 이미지 가져오기
const getImagesFromFolder = (folderPath) => {
  return axios.post(API_URL + 'folder', { folderPath }, {
    headers: getAuthHeader()
  });
};

// 어노테이션 저장
const saveAnnotations = (data) => {
  return axios.post(API_URL + 'save', data, {
    headers: getAuthHeader()
  });
};

// 사용자 어노테이션 목록 가져오기
const getUserAnnotations = () => {
  return axios.get(API_URL + 'list', {
    headers: getAuthHeader()
  });
};

// 어노테이션 다운로드
const downloadAnnotation = (id) => {
  return axios.get(`${API_URL}download/${id}`, {
    headers: getAuthHeader(),
    responseType: 'blob'
  });
};

export default {
  uploadFolder,
  getImagesFromFolder,
  saveAnnotations,
  getUserAnnotations,
  downloadAnnotation
};
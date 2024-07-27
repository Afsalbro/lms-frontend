import axios from 'axios';

// Set the base URL for your Laravel backend
const API_URL = 'http://localhost:8000/api'; 

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to set the token in the headers
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Authentication
export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);
export const logout = () => api.post('/logout');

// Courses
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

//Public Courses
export const getallCourses = () => api.get('/courses');

// Students
export const getStudents = () => api.get('/students');
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Enrollments
export const getEnrollments = () => api.get('/enrollments');
export const getEnrollment = (id) => api.get(`/enrollments/${id}`);
export const createEnrollment = (data) => api.post('/enrollments', data);
export const updateEnrollment = (id, data) => api.put(`/enrollments/${id}`, data);
export const deleteEnrollment = (id) => api.delete(`/enrollments/${id}`);

// Export the Axios instance and setAuthToken function
export { api, setAuthToken };

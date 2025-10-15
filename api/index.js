import axios from 'axios';

// const API_BASE_URL = 'http://localhost/phpclass/blog/index.php';
const API_BASE_URL = 'https://gposts.infinityfreeapp.com/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// add a request interceptor to include jwt token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);

export const getPosts = () => api.get('/posts');
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (FormData) =>{
    const token = localStorage.getItem('token');
    const headers = {'content-Type':null};
    if(token){
        headers.Authorization = `Bearer ${token}`;
    }
    return api.post('/posts', FormData, {headers});
}
export const updatePost = (id, FormData) => 
    api.put(`/posts/${id}`, FormData, {
    headers: {'content-Type': 'multipart/form-data'},
});
export const deletePost = (id) => api.delete(`/posts/${id}`);

export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getComments = (postId) => api.get(`/comments` , {params: {postId : postId}});
export const createComment = (data) => api.post(`/comments`, data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);
export const updateComment = (id, data) => api.put(`/comments/${id}`, data);

export default api;

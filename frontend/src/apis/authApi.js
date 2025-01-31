import axiosInstance from "../config/axios"
const authApi = {
    login : (email,password) => axiosInstance.post('/user/login',{email,password}),
    signup : (email,password) =>axiosInstance.post('/user/register',{email,password}),
    allUser : (projectId) =>  axiosInstance.get('/user/all',{projectId})
  }
export default authApi;
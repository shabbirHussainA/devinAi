import axiosInstance from "../config/axios"
const authApi = {
    login : (email,password) => axiosInstance.post('/user/login',{email,password}),
    signup : (email,password) =>axiosInstance.post('/user/register',{email,password}),
    allUser : () =>  axiosInstance.get('/user/all')
  }
export default authApi;
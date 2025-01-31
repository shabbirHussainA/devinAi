import axiosInstance from "../config/axios";

const projApi = {
    create: (name) =>  axiosInstance.post('/project/create', { name }),
    getAll: () => axiosInstance.get('/project/all'),
    getDetails: ({projectId}) =>axiosInstance.get(`/project/get-project/${projectId}`),
    addUsers: ({projectId,users}) =>axiosInstance.put('/project/add-users',{projectId,users})     
}
export default projApi
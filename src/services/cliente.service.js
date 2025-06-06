import axiosInstance from "../utils/axiosConfig";

const getAll = () => {
  return axiosInstance.get('/api/v1/clientes');
};

const getById = id => {
  return axiosInstance.get(`/api/v1/cliente/${id}`);
};



export default {getAll, getById};
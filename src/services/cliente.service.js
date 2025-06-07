import axiosInstance from "../utils/axiosConfig";

const getAll = () => {
  return axiosInstance.get('/api/v1/clientes');
};

const getById = id => {
  return axiosInstance.get(`/api/v1/cliente/${id}`);
};

const create = data => {
  return axiosInstance.post("/api/v1/cliente",data);
};


export default {getAll, getById, create};
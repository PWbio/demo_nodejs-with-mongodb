import axios from "axios";

const host = "http://localhost:8080";
export const get = async () => await axios.get(`${host}/api/get`);

export const post = async (data) => await axios.post(`${host}/api/post`, data);

export const deleteOne = async (id) =>
  await axios.delete(`${host}/api/delete`, { data: { id } });

export const deleteAll = async () =>
  await axios.delete(`${host}/api/delete_all`);

export const put = async (data) => await axios.put(`${host}/api/put`, data);

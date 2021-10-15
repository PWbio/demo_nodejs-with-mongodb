import axios from "axios";

const host = "http://localhost:8080";
export const get = async () => await axios.get(`${host}/get`);

export const post = async (data) => await axios.post(`${host}/post`, data);

export const deleteOne = async (id) =>
  await axios.delete(`${host}/delete`, { data: { id } });

export const deleteAll = async () => await axios.delete(`${host}/delete_all`);

export const put = async (data) => await axios.put(`${host}/put`, data);

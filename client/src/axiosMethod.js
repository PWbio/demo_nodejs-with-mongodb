import axios from "axios";

const host = "http://localhost:8080";
export const get = async () => await axios.get(`${host}/api/company`);

export const post = async (data) =>
  await axios.post(`${host}/api/company`, data);

export const deleteOne = async (id) =>
  await axios.delete(`${host}/api/company/one/${id}`);

export const deleteAll = async () =>
  await axios.delete(`${host}/api/company/all`);

export const put = async (data) =>
  await axios.put(`${host}/api/company/one/${data.id}`, {
    ...data,
    id: undefined,
  });

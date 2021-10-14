import axios from "axios";

const host = "http://localhost:8080";
export const get = async () => await axios.get(host);

export const post = async (data) => await axios.post(host, data);

export const deleteOne = async (id) =>
  await axios.delete(host, { data: { id } });

export const deleteAll = async () => await axios.delete(`${host}/delete_all`);

export const put = async (data) => await axios.put(host, data);

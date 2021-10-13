import axios from "axios";

const host = "http://localhost:8080";
export const get = async () => axios.get(host);

export const post = async (data) => {
  try {
    const result = await axios.post(host, data);
    // console.log("success", result);
  } catch (e) {
    console.log("fail");
    console.log(e.response);
    // if (e.response) console.log(e.reponse.data);
  }
};

export const delete_ = async (id) => axios.delete(host, { data: { id } });

// const post = async () => {
//     try {
//       const result = await axios.post("http://localhost:8080", {
//         name: "cpu store",
//         contact: "po",
//         phone: "+886-123-1234",
//         address: "taipei city",
//       });
//       console.log("success", result);
//     } catch (e) {
//       console.log("fail", e.response.data);
//     }
//   };

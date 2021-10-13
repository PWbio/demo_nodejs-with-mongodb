import AddingBox from "./components/AddingBox";
import Header from "./components/Header";
import Shop from "./components/Shop";
import axios from "axios";

const get = async () => {
  try {
    const result = await axios.get("http://localhost:8080");
    console.log("success", result);
  } catch (e) {
    console.log("fail", e.message);
  }
};

const post = async () => {
  try {
    const result = await axios.post("http://localhost:8080", {
      name: "cpu store",
      contact: "po",
      phone: "+886-123-1234",
      address: "taipei city",
    });
    console.log("success", result);
  } catch (e) {
    console.log("fail", e.response.data);
  }
};

function App() {
  return (
    <>
      <Header />
      <AddingBox />
      <Shop name="Cookie shop" contact="Po" address="street 1" phone="886" />
      <button onClick={get}>GET</button>
      <button onClick={post}>POST</button>
    </>
  );
}

export default App;

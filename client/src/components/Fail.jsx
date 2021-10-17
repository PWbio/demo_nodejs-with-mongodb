import React, { useEffect } from "react";
import axios from "axios";

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const Fail = () => {
  useEffect(() => {
    axios.get("http://localhost:8080/");
  }, []);
  return (
    <>
      <h1>Failed to login</h1>
      {console.log(Object.keys(params))}
      {Object.keys(params).map((key) => (
        <p>
          {key}: {params[key]}
        </p>
      ))}
    </>
  );
};

export default Fail;

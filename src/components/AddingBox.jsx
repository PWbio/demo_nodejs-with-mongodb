import React from "react";
import S from "./AddingBox.module.scss";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const AddingBox = () => {
  return (
    <div className={S.box}>
      <h1>Create New Shop Info </h1>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        autoComplete="off"
      >
        <TextField id="shopname" label="Your Shop's Name" variant="standard" />
        <TextField id="contact" label="Contact" variant="standard" />
        <TextField id="address" label="Address" variant="standard" />
        <TextField id="phone" label="Phone Number" variant="standard" />
      </Box>
    </div>
  );
};

export default AddingBox;

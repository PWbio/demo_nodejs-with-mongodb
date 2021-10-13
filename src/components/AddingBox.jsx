import React, { useState } from "react";
import S from "./AddingBox.module.scss";
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { post } from "../axiosMethod";
import faker from "faker";

const metadata = [
  {
    field: "name",
    label: "Company Name",
  },
  {
    field: "address",
    label: "Address",
  },
  {
    field: "contact",
    label: "Contact",
  },
  {
    field: "phone",
    label: "Phone Number",
  },
];

const AddingBox = () => {
  const [fields, setFields] = useState({
    name: "",
    address: "",
    contact: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("submit", fields);
    await post(fields);
  };

  const makeSomeData = () => {
    setFields({
      name: faker.company.companyName(),
      address: `${faker.address.streetAddress()}, ${faker.address.cityName()} ${faker.address.zipCode()}, ${faker.address.country()}`,
      contact: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
    });
  };

  return (
    <div className={S.box}>
      <h1>Create New Company Info </h1>

      <form
        // noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {metadata.map((v) => {
          return (
            <TextField
              key={v.field}
              id={v.field}
              label={v.label}
              variant="outlined"
              value={fields[v.field]}
              onChange={(e) => {
                setFields({ ...fields, [v.field]: e.target.value });
              }}
              required
              fullWidth
              className={S.textField}
              margin="normal"
              size="small"
            />
          );
        })}
        <Button onClick={makeSomeData} variant="outlined">
          New Data
        </Button>
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
          submit (POST)
        </Button>
      </form>
    </div>
  );
};

export default AddingBox;

import React, { useState } from "react";
import S from "./AddingBox.module.scss";
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { post } from "../axiosMethod";
import faker from "faker";
import usePrompt from "../hook/Message";

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

const AddingBox = ({ setRefresh }) => {
  const { Notification, setAlert } = usePrompt();

  const [fields, setFields] = useState({
    name: "",
    address: "",
    contact: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post(fields);
      setAlert({
        open: true,
        status: "success",
        message: "Succesfully post 1 entry to database.",
      });
      setRefresh((prev) => !prev);
    } catch (e) {
      setAlert({
        open: true,
        status: "error",
        message: `Failed to post data to database. (${e.message})`,
      });
    }
  };

  const spawnData = () => {
    return {
      name: faker.company.companyName(),
      address: `${faker.address.streetAddress()}, ${faker.address.cityName()} ${faker.address.zipCode()}, ${faker.address.country()}`,
      contact: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
    };
  };

  const newOneData = () => {
    setFields(spawnData());
  };

  const newTenData = async () => {
    const data = [...Array(10).keys()].map((i) => spawnData());
    try {
      await post(data);
      setAlert({
        open: true,
        status: "success",
        message: "Succesfully post 10 entries to database.",
      });
      setRefresh((prev) => !prev);
    } catch (e) {
      setAlert({
        open: true,
        status: "error",
        message: `Failed to post data to database. (${e.message})`,
      });
    }
  };

  return (
    <>
      <Notification />
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
          <Button onClick={newOneData} variant="outlined">
            New Data (1)
          </Button>
          <Button
            onClick={newTenData}
            variant="contained"
            endIcon={<SendIcon />}
          >
            New Data (10)
          </Button>
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            submit (POST)
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddingBox;

import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import S from "./CompanyTable.module.scss";
import { get } from "../axiosMethod";
import Notification from "./Notification";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import WarningIcon from "@mui/icons-material/Warning";

// Column Config (x-data-grid)
const columns = [
  { field: "company", headerName: "Company", width: 150, editable: true },
  { field: "address", headerName: "Address", width: 150, editable: true },
  { field: "contact", headerName: "Contact", width: 150, editable: true },
  { field: "phone", headerName: "Phone", width: 150, editable: true },
];

const CompanyTable = () => {
  const [rows, setRows] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    status: "success",
    message: "",
  });
  const { open, status, message } = alert;

  const getData = async (simulateError = false) => {
    try {
      if (simulateError) throw new Error("Just a fake alarm.");
      const { data } = await get();
      // console.log(data);
      const parseData = data.map((v) => ({
        id: v._id, // require, @mui/x-data-grid.
        company: v.name,
        address: v.address,
        contact: v.contact,
        phone: v.phone,
      }));
      // console.log(parseData);
      setRows(parseData);
      setAlert({
        open: true,
        status: "success",
        message: "Succesfully retrieved data from database.",
      });
    } catch (e) {
      console.log(e.message);
      setAlert({
        open: true,
        status: "error",
        message: `Failed to get data from database. (${e.message})`,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h1>Company Table</h1>
      <div className={S.buttons}>
        <Button
          onClick={() => getData()}
          variant="contained"
          endIcon={<CloudDownloadIcon />}
        >
          Refresh (GET)
        </Button>
        <Button onClick={() => setRows([])} variant="outlined">
          Clear Table
        </Button>
        <Button
          onClick={() => getData(true)}
          variant="outlined"
          color="error"
          endIcon={<WarningIcon />}
        >
          Make An Error (GET)
        </Button>
      </div>

      <div className={S.tableContainer}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection={true}
          rowHeight={30}
        />
      </div>
      {open && (
        <Notification
          open={open}
          status={status}
          message={message}
          setOpenState={setAlert}
        />
      )}
    </>
  );
};

export default CompanyTable;

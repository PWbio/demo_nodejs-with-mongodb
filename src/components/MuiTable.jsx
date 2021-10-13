import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { get, delete_ } from "../axiosMethod";

import S from "./MuiTable.module.scss";

import Button from "@mui/material/Button";
import Notification from "./Notification";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import WarningIcon from "@mui/icons-material/Warning";

import Tooltip from "@mui/material/Tooltip";

const columns = [
  { field: "company", headerName: "Company", width: 150 },
  { field: "address", headerName: "Address", width: 150 },
  { field: "contact", headerName: "Contact", width: 150 },
  { field: "phone", headerName: "Phone", width: 150 },
];

const MuiTable = () => {
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
      //   console.log(parseData);
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

  const deleteData = async (id, index) => {
    // console.log(id, index);
    try {
      const { data } = await delete_(id);
      // console.log(data);
      const copyRows = [...rows];
      copyRows.splice(index, 1);
      setRows(copyRows);
      setAlert({
        open: true,
        status: "success",
        message: `Succesfully deleted data from database: ${data.name}`,
      });
    } catch (e) {
      console.log(e.message);
      setAlert({
        open: true,
        status: "error",
        message: `Failed to deleted data from database. (${e.message})`,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {open && (
        <Notification
          open={open}
          status={status}
          message={message}
          setOpenState={setAlert}
        />
      )}

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
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field}>{col.headerName}</TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIdx) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{
                      minWidth: col.width,
                    }}
                  >
                    <Tooltip title={row[col.field]} placement="top" arrow>
                      <div className={S.cell}>{row[col.field]}</div>
                    </Tooltip>
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    color="error"
                    onClick={() => deleteData(row.id, rowIdx)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MuiTable;

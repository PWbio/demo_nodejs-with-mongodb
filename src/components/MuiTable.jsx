import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { get, deleteOne, deleteAll } from "../axiosMethod";

import S from "./MuiTable.module.scss";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Notification from "./Notification";
import usePrompt from "../hook/Message";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import WarningIcon from "@mui/icons-material/Warning";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import PublishIcon from "@mui/icons-material/Publish";

import Tooltip from "@mui/material/Tooltip";

const columns = [
  { field: "company", headerName: "Company", width: 150 },
  { field: "address", headerName: "Address", width: 150 },
  { field: "contact", headerName: "Contact", width: 150 },
  { field: "phone", headerName: "Phone", width: 150 },
];

const EditableCell = ({ rowData, colName, onChange }) => {
  const { editMode } = rowData;
  const value = rowData[colName];
  return (
    <TableCell>
      {editMode ? (
        <TextField
          value={value}
          name={colName}
          onChange={(e) => onChange(e, rowData)}
        ></TextField>
      ) : (
        <Tooltip title={value} placement="top" arrow>
          <div className={S.cell}>{value}</div>
        </Tooltip>
      )}
    </TableCell>
  );
};

const MuiTable = () => {
  const [rows, setRows] = useState([]);
  const [rowSnapshot, setRowSnapshot] = useState(new Object());
  const { Notification, setAlert } = usePrompt();

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
        editMode: false,
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
      const { data } = await deleteOne(id);
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

  const deleteAllData = async () => {
    // need try-catch block
    await deleteAll();
    console.log("delete all data");
  };

  const toggleEditMode = (id, state) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, editMode: state } : row))
    );
  };

  const openEditor = (rowData) => {
    // Make snapshot of current data (first open editor)
    const { id } = rowData;
    setRowSnapshot((prevShot) => ({ ...prevShot, [id]: rowData }));
    toggleEditMode(id, true);
  };

  const closeEditor = (rowData, publish) => {
    const { id } = rowData;
    if (publish) {
      console.log("save");
    } else {
      console.log("discard");
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...rowSnapshot[id] } : row))
      );
      // cannot us
    }
    toggleEditMode(id, false);
  };

  const handleCellChange = (e, rowData) => {
    const { id } = rowData;
    const newValue = e.target.value;
    const colName = e.target.name;
    const newRowData = rows.map((row) =>
      row.id === id ? { ...row, [colName]: newValue } : row
    );
    setRows(newRowData);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Notification />
      <button onClick={() => console.log(rowSnapshot)}>test</button>
      <div className={S.buttons}>
        <Button
          onClick={() => getData()}
          variant="contained"
          endIcon={<CloudDownloadIcon />}
        >
          Refresh (GET)
        </Button>
        <Button onClick={() => setRows([])} variant="outlined">
          Clear Table (offline)
        </Button>
        <Button
          onClick={() => deleteAllData()}
          variant="outlined"
          color="error"
        >
          Remove All Data (DELETE)
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
              {/* edit button column */}
              <TableCell></TableCell>
              {/* data columns */}
              {columns.map((col) => (
                <TableCell key={col.field}>{col.headerName}</TableCell>
              ))}
              {/* delete button column */}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIdx) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {row.editMode ? (
                  <>
                    <TableCell>
                      <Button
                        endIcon={<PublishIcon />}
                        onClick={() => closeEditor(row, true)}
                      />
                      <Button
                        endIcon={<RestoreIcon />}
                        onClick={() => closeEditor(row, false)}
                      />
                    </TableCell>
                  </>
                ) : (
                  <TableCell>
                    <Button
                      endIcon={<EditIcon />}
                      onClick={() => openEditor(row)}
                    />
                  </TableCell>
                )}

                {columns.map((col) => (
                  <EditableCell
                    key={col.field}
                    {...{
                      rowData: row,
                      colName: col.field,
                      onChange: handleCellChange,
                    }}
                  />
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
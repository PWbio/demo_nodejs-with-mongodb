import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import WarningIcon from "@mui/icons-material/Warning";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import PublishIcon from "@mui/icons-material/Publish";

import * as api from "../axiosMethod";
import S from "../scss/MuiTable.module.scss";
import usePrompt from "../hook/Message";

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

const MuiTable = ({ refresh, setRefresh }) => {
  const [rows, setRows] = useState([]);
  const [rowSnapshot, setRowSnapshot] = useState({});
  const { Notification, setAlert } = usePrompt();

  const getData = async (message = true, simulateError = false) => {
    try {
      if (simulateError) throw new Error("Just a fake alarm.");
      const { data } = await api.get();
      // console.log(data);
      const parseData = data.map((v) => ({
        id: v._id, // require, @mui/x-data-grid.
        company: v.name,
        address: v.address,
        contact: v.contact,
        phone: v.phone,
        editMode: false,
      }));
      // console.log(parseData);
      setRows(parseData);
      if (message) {
        setAlert({
          open: true,
          status: "success",
          message: "Succesfully retrieved data from database.",
        });
      }
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
    try {
      await api.deleteOne(id);
      const copyRows = [...rows];
      copyRows.splice(index, 1);
      setRows(copyRows);
      setAlert({
        open: true,
        status: "success",
        message: "Deleted one data from database.",
      });
    } catch (e) {
      console.log(e.message);
      setAlert({
        open: true,
        status: "error",
        message: `Failed to delete data from database. (${e.message})`,
      });
    }
  };

  const deleteAllData = async () => {
    // need try-catch block
    try {
      await api.deleteAll();
      setAlert({
        open: true,
        status: "success",
        message: "Succesfully deleted all data from database",
      });
      getData(false);
    } catch (e) {
      console.log(e.message);
      setAlert({
        open: true,
        status: "error",
        message: `Failed to delete all data from database. (${e.message})`,
      });
    }
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

  const closeEditor = async (rowData, publish) => {
    const { id } = rowData;
    if (publish) {
      console.log("save");
      try {
        await api.put({
          id: rowData.id,
          name: rowData.company,
          address: rowData.address,
          contact: rowData.contact,
          phone: rowData.phone,
        });
        setAlert({
          open: true,
          status: "success",
          message: "Successfully updated data !",
        });
      } catch (e) {
        console.log(e.message);
        setAlert({
          open: true,
          status: "error",
          message: `Failed to update data. (${e.message})`,
        });
      }
    } else {
      console.log("discard");
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...rowSnapshot[id] } : row))
      );
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

  useEffect(() => {
    getData(false);
  }, [refresh]);

  return (
    <>
      <Notification />
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
          onClick={() => getData(true, true)}
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

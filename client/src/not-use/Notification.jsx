import { Alert, Snackbar } from "@mui/material";

const Notification = ({ open, status, message, setOpenState }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return; // prevent from closing when user click somewhere else in the window.
    setOpenState(false);
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleClose} severity={status} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Notification;

import React, { useState, useCallback } from "react";
import { Alert, Snackbar } from "@mui/material";

const usePrompt = () => {
  const [alert, setAlert] = useState({
    open: false,
    status: "success",
    message: "",
  });

  const { open, status, message } = alert;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return; // prevent from closing when user click somewhere else in the window.
    setAlert({ ...alert, open: false });
  };

  // use callback to prevent unnecessary rendering
  const Notification = useCallback(
    () => (
      <>
        {open && (
          <Snackbar
            open={open}
            autoHideDuration={3500}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Alert
              onClose={handleClose}
              severity={status}
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>
        )}
      </>
    ),
    [open]
  );

  return { Notification, setAlert };
};

export default usePrompt;

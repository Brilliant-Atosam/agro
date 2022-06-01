import { Close } from "@mui/icons-material";
import { IconButton, Snackbar } from "@mui/material";
import React from "react";
export default function SimpleSnackbar({ open, handleClose, message }) {
  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <Close fontSize="small" />
    </IconButton>
  );

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={7000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  );
}

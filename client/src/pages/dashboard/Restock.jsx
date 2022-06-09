import { Check, Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";

const Restock = ({
  openStock,
  handleClose,
  name,
  restockEvent,
  handleRestock,
}) => {
  return (
    <Dialog open={openStock} onClose={handleClose}>
      <DialogTitle className="dial-heading">RESTOCK DRUG</DialogTitle>
      <DialogContent>
        <DialogContentText>{name}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Restock"
          type="number"
          fullWidth
          variant="outlined"
          className="dial-input"
          onChange={restockEvent}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          <Close className="dial-icon cancel" />
        </Button>
        <Button onClick={handleRestock}>
          <Check className="dial-icon" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Restock;

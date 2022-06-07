import {
  TextField,
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Close, Check } from "@mui/icons-material";

export default function FormDialog({
  open,
  handleClose,
  nameEvent,
  supplierEvent,
  implicationsEvent,
  priceEvent,
  dossageEvent,
  expiryEvent,
  handleEdit,
  name,
  supplier,
  implications,
  price,
  dosage,
}) {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="dial-heading">ADD/EDIT ITEM FORM</DialogTitle>
        <DialogContent>
          <DialogContentText>Kindly fill all fields</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Item name"
            value={name}
            type="text"
            fullWidth
            variant="outlined"
            className="dial-input"
            onChange={nameEvent}
          />
          <TextField
            margin="dense"
            label="Supplier"
            type="text"
            fullWidth
            value={supplier}
            variant="outlined"
            className="dial-input"
            onChange={supplierEvent}
          />
          <TextField
            margin="dense"
            onChange={implicationsEvent}
            label="Implications"
            type="text"
            value={implications}
            fullWidth
            variant="outlined"
            className="dial-input"
          />
          <TextField
            margin="dense"
            onChange={priceEvent}
            label="Price"
            type="number"
            value={price}
            fullWidth
            variant="outlined"
            className="dial-input"
          />
          <TextField
            margin="dense"
            label="Dosage"
            type="text"
            fullWidth
            variant="outlined"
            value={dosage}
            onChange={dossageEvent}
            className="dial-input"
          />
          <TextField
            variant="outlined"
            margin="dense"
            fullWidth
            label="Expiry date"
            type="date"
            onChange={expiryEvent}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <Close className="dial-icon cancel" />
          </Button>
          <Button onClick={handleEdit}>
            <Check />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

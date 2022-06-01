import {
  TextField,
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Close, CurrencyExchange } from "@mui/icons-material";

export default function SellItemForm({
  open,
  handleClose,
  itemName,
  stock,
  price,
  quantity,
  quantityEvent,
  handleSellItem,
}) {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="dial-heading">SELL ITEM</DialogTitle>
        <DialogContent>
          <DialogContentText>{itemName}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            className="dial-input"
            onChange={quantityEvent}
          />
          <DialogContentText>Stock: {stock}</DialogContentText>
          <DialogContentText>Price: &#8373;{price}</DialogContentText>
          <DialogContentText>
            Total cost: <b>&#8373;{price * quantity}</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <Close className="dial-icon cancel" />
          </Button>
          <Button onClick={handleSellItem}>
            <CurrencyExchange className="dial-icon" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

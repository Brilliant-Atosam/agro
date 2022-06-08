import moment from "moment";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
export default function Summary({ open, close }) {
  const allItems = useSelector((state) => state.items.Items);
  const pieces = [];
  allItems.forEach((item) => pieces.push(item.stock));
  const inStock = allItems.filter((item) => item.stock > 0);
  let inStockFigures = [];
  inStock.forEach((item) => inStockFigures.push(item.price * item.stock));
  const costInstock = inStockFigures.reduce((a, b) => a + b);

  const salesRecords = useSelector((state) => state.sales.Sales);
  let totalSalesFigures = [];
  salesRecords.forEach((sale) => totalSalesFigures.push(sale.cost));
  const totalSalesFigure =
    totalSalesFigures.length > 0
      ? totalSalesFigures.reduce((a, b) => a + b)
      : 0;
  const expired = allItems?.filter(
    (item) => new Date(item.expiry) <= new Date()
  );
  const expPieces = [];
  expired.forEach((item) => expPieces.push(item.stock));
  let expFigures = [];
  expired.forEach((item) => expFigures.push(item.price * item.stock));
  const expCost = expFigures.reduce((a, b) => a + b);

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>
        STORE SUMMARY AS AT <b>{moment().format("ddd DD MMM YYYY")}</b>
      </DialogTitle>
      <div className="tuts">
        <h1 className="heading">Store's info</h1>
        <div className="icon-meaning">
          <span className="icon">Sales made:</span>
          <b className="meaning">GH&#8373; {totalSalesFigure}</b>
        </div>
        <div className="icon-meaning">
          <span className="icon">No. of items in stock:</span>
          <b className="meaning">{inStock.length}</b>
        </div>
        <div className="icon-meaning">
          <span className="icon">No. of pieces of items in stock:</span>
          <b className="meaning">{pieces.reduce((a, b) => a + b)}</b>
        </div>
        <div className="icon-meaning">
          <span className="icon">Total Cost of Items in stock(+expired):</span>
          <b className="meaning">GH&#8373; {costInstock}</b>
        </div>
        <div className="icon-meaning">
          <span className="icon">No. of expired items:</span>
          <b className="meaning">{expired.length}</b>
        </div>
        <div className="icon-meaning">
          <span className="icon">No. of pieces of expired items:</span>
          <b className="meaning">{expPieces.reduce((a, b) => a + b)}</b>
        </div>
        <div className="icon-meaning">
          <span className="icon">Total Cost of Expired Items:</span>
          <b className="meaning">GH&#8373; {expCost}</b>
        </div>
        <div className="icon-meaning">
          <span className="icon">Floating cash(-expired):</span>
          <b className="meaning">GH&#8373;{costInstock - expCost}</b>
        </div>
      </div>
      <DialogContent>
        <DialogContentText></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>
          <Close className="cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { usePaystackPayment } from "react-paystack";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/login";
import { request } from "../request";
export default function Subscribe({
  open,
  subTitle,
  subContent,
  btnText,
  amount,
}) {
  const dispatch = useDispatch();
  const storeId = localStorage.getItem("storeId");
  const initializePayment = usePaystackPayment({
    currency: "GHS",
    amount: amount * 100,
    email: "1bongostores@gmail.com",
    publicKey: "pk_live_5017792627bf13f97690448a69a46d0f4432d8a9",
    channels: ["mobile_money"],
    label: `Store id: ${storeId}`,
  });
  const onClose = () => {
    window.location.reload();
  };
  const handleSubscribe = async () => {
    const res = await request.put(`/store/${storeId}`, {});
    alert(res.data);
    dispatch(Logout());
  };
  const onSuccess = () => {
    handleSubscribe();
  };
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>{subTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{subContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(Logout())}>Logout</Button>
          <Button
            onClick={() => {
              initializePayment(onSuccess, onClose);
            }}
          >
            {btnText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

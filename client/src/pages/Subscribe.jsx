import { usePaystackPayment } from "react-paystack";
import { useDispatch } from "react-redux";
import { LoginFailure, LoginStart, LoginSuccess, Logout } from "../redux/login";
import { request } from "../request";
const storeId = localStorage.getItem("storeId");
const Subscribe = () => {
  const dispatch = useDispatch();
  const callLogin = async () => {
    dispatch(LoginStart());
    try {
      const res = await request.post("/auth/renew", {
        id: storeId,
      });
      dispatch(LoginSuccess(res.data));
      window.location.href = "/";
    } catch (err) {
      dispatch(LoginFailure(err.response.data));
    }
  };
  const onSuccess = () => {
    callLogin();
  };

  const onClose = () => {
    window.location.reload();
  };
  const initializePayment = usePaystackPayment({
    currency: "GHS",
    amount: 3000,
    email: "atosam91@gmail.com",
    publicKey: process.env.REACT_APP_PAYSTACK_PK,
    channels: ["mobile_money"],
    label: `Store id: ${storeId}`,
  });
  return (
    <div className="login-container p20">
      <div className="message">
        Your store has been created. Your store's id is <b>{storeId}</b>
      </div>
      <button
        className="btn btn-sub"
        onClick={() => {
          initializePayment(onSuccess, onClose);
        }}
      >
        Activate Store - &#8373;30
      </button>
      <span className="notice">
        NB: If are not automatically redirected to your dashboard, after a
        successful subsription,
        <button className="link" onClick={() => dispatch(Logout())}>
          click here
        </button>{" "}
      </span>
    </div>
  );
};

export default Subscribe;

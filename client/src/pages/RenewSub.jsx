import { LoginStart, LoginSuccess, LoginFailure, Logout } from "../redux/login";
import { usePaystackPayment } from "react-paystack";
import { useDispatch } from "react-redux";
import { request } from "../request";
const storeId = localStorage.getItem("storeId");
const RenewSub = () => {
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
    amount: 2000,
    email: "atosam91@gmail.com",
    publicKey: process.env.REACT_APP_PAYSTACK_PK,
    channels: ["mobile_money"],
    label: `Store id: ${storeId}`,
  });
  return (
    <div className="login-container p20">
      <div className="message">
        Subscription for store with ID <b>{storeId}</b> is due for renewal
      </div>
      <button
        className="btn btn-sub"
        onClick={() => {
          initializePayment(onSuccess, onClose);
        }}
      >
        Renew Store Subscription - &#8373;20
      </button>
      <span className="notice">
        NB: If are not automatically redirected to your dashboard, after a
        successful subsription,
        <button className="link" onClick={() => dispatch(Logout())}>
          click here
        </button>
      </span>
    </div>
  );
};

export default RenewSub;

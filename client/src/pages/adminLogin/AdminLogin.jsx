import Input from "../../components/input/Input";
import AlertComponent from "../../components/Alert";
import { useState } from "react";
import { request } from "../../request";
import Loading from "../../components/Loading";
import { LoginStart, LoginSuccess, LoginFailure } from "../../redux/admin";
import { useDispatch } from "react-redux";
import {
  clientsFailure,
  clientsStart,
  clientsSuccess,
} from "../../redux/clients";
export const AdminLogin = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState(localStorage.getItem("storeId"));
  const [password, setPassword] = useState("");
  const [severity, setSeverity] = useState("info");
  const [message, setMessage] = useState("info");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    if (!email || password.length < 5) {
      setOpen(true);
      setSeverity("warning");
      setMessage("Invalid login input");
      setLoading(false);
    } else {
      dispatch(LoginStart());
      try {
        const res = await request.post("/auth/admin", {
          email,
          password,
        });
        setOpen(true);
        setSeverity("success");
        setMessage("Login successful. Redirecting to dashoard");
        dispatch(LoginSuccess(res.data));
        dispatch(clientsStart());
        const clients = await request.get(`/store`);
        dispatch(clientsSuccess(clients.data));
      } catch (err) {
        dispatch(clientsFailure(err.response.data));
        dispatch(LoginFailure(err.response.data));
        setOpen(true);
        setSeverity("error");
        setMessage(err.response.data);
        setLoading(false);
      }
    }
  };
  return (
    <div className="login-container p20">
      <Loading open={loading} />
      <h1 className="login-greetings">Welcome Admin! Login to continue</h1>
      <AlertComponent
        open={open}
        close={() => setOpen(false)}
        severity={severity}
        message={message}
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        event={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        event={(e) => setPassword(e.target.value)}
      />
      <button
        className="btn login-btn"
        disabled={loading}
        onClick={() => handleLogin()}
      >
        {loading ? "Please wait..." : "Sign in"}
      </button>
    </div>
  );
};

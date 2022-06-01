import Input from "../../components/input/Input";
import AlertComponent from "../../components/Alert";
import { useState } from "react";
import { request } from "../../request";
import Loading from "../../components/Loading";
import { Link, Navigate } from "react-router-dom";
export const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [severity, setSeverity] = useState("info");
  const [message, setMessage] = useState("info");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleRegister = async () => {
    setLoading(true);
    if (!name || password.length < 5 || password !== password2) {
      setOpen(true);
      setSeverity("warning");
      setMessage("Invalid inputs/mismatched passwords");
      setLoading(false);
    } else {
      try {
        const res = await request.post("/store", {
          name,
          phone,
          password,
        });
        await localStorage.setItem("storeId", res.data.id);
        window.location.href = "/login";
      } catch (err) {
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
      <h1 className="login-greetings">Welcome! Create Account to continue</h1>
      <AlertComponent
        open={open}
        close={() => setOpen(false)}
        severity={severity}
        message={message}
      />
      <Input
        type="text"
        placeholder="Store Name"
        value={name}
        event={(e) => setName(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Phone number"
        value={phone}
        event={(e) => setPhone(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        event={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm Password"
        value={password2}
        event={(e) => setPassword2(e.target.value)}
      />
      <button
        className="btn login-btn"
        disabled={loading}
        onClick={() => handleRegister()}
      >
        {loading ? "Please wait..." : "Create Account"}
      </button>
      <Link to="/login" className="instead">
        Login in instead
      </Link>
    </div>
  );
};

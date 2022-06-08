import {
  InfoOutlined,
  LockReset,
  ManageAccounts,
  Settings,
  WhatsApp,
} from "@mui/icons-material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { request } from "../request";
import Password from "./Password";
import Summary from "./StoreSummary";

export default function Footer() {
  const storeId = localStorage.getItem("storeId");
  const store = useSelector((state) => state.store.Store);
  const [openPass, setOpenPass] = useState(false);
  const [openSum, setOpenSum] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [admin, setAdmin] = useState(false);
  const handleReset = async () => {
    if (!oldPassword || !password || !password2) {
      setOpenAlert(true);
      setSeverity("warning");
      setMessage("Provide data for all fields");
    } else if (password !== password2) {
      setOpenAlert(true);
      setSeverity("warning");
      setMessage("Passwords do not match");
    } else {
      try {
        const res = await request.put(`/store/password/reset?id=${storeId}`, {
          password,
          oldPassword,
          admin,
        });
        setOpenAlert(true);
        setMessage(res.data);
        setSeverity("success");
      } catch (err) {
        setOpenAlert(true);
        setMessage(err.response.data);
        setSeverity("error");
      }
    }
  };
  return (
    <div className="footer">
      <Password
        open={openPass}
        close={() => setOpenPass(false)}
        reset={() => handleReset()}
        severity={severity}
        message={message}
        closeAlert={() => setOpenAlert(false)}
        openAlert={openAlert}
        oldEvent={(e) => setOldPassword(e.target.value)}
        newEvent={(e) => setPassword(e.target.value)}
        confirmEvent={(e) => setPassword2(e.target.value)}
        adminEvent={(e) => setAdmin(!admin)}
      />
      <Summary open={openSum} close={() => setOpenSum(false)} />
      <div className="footer-items">
        <a href="https://wa.me/233553385436" className="footer-links">
          <WhatsApp /> Feedback
        </a>
        <li
          className="footer-links"
          onClick={() => {
            store.mode !== "Admin"
              ? alert("You don't have such privilege")
              : setOpenPass(true);
          }}
        >
          <LockReset />
          Reset password
        </li>
        <li
          className="footer-links"
          onClick={() => {
            store.mode !== "Admin"
              ? alert("You don't have such privilege")
              : setOpenSum(true);
          }}
        >
          <InfoOutlined /> Store Summary
        </li>
        <li className="footer-links">
          <Settings /> Store settings
        </li>
        <li className="footer-links">
          <ManageAccounts /> Other apllications
        </li>
      </div>
      <span className="ml10">&copy;2022</span>
    </div>
  );
}

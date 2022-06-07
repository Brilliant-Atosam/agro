import "./navbar.css";
import { Autorenew } from "@mui/icons-material";
import LogoutSharp from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { Logout } from "../../redux/admin";
import { useDispatch } from "react-redux";
import { clearClients } from "../../redux/clients";

const NavbarAdmin = ({ refresh }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(Logout());
    dispatch(clearClients());
    window.location.href = "/admin";
  };

  return (
    <div className="navbar-container">
      <div className="nav-left">
        <Link to="/">
          <h1 className="logo">Home</h1>
        </Link>
        <li className="refresh" key={0} onClick={refresh}>
          <Autorenew />
        </li>
      </div>
      <div className="nav-right">
        <div className="menu-list">
          <li
            className="menu-item- sign-out btn"
            onClick={() => handleLogout()}
            key={4}
          >
            <LogoutSharp className="ml5" />
          </li>
        </div>
      </div>
    </div>
  );
};
export default NavbarAdmin;

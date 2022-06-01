import Navbar from "../../components/nav/Navbar";
import "./tutorials.css";
import {
  ArrowForwardIos,
  MedicalServices,
  Visibility,
  CurrencyExchange,
  RestartAlt,
  Close,
  Delete,
  Edit,
} from "@mui/icons-material";
export const Tutorials = () => {
  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="tuts">
          <h1 className="heading">Interpretation to icons</h1>
          <div className="icon-meaning">
            <MedicalServices className="icon" />
            <span className="meaning">Add new drug to store</span>
          </div>
          <div className="icon-meaning">
            <Visibility className="icon" />
            <span className="meaning">See drug details</span>
          </div>
          <div className="icon-meaning">
            <CurrencyExchange className="icon" />
            <span className="meaning">Sell drug</span>
          </div>
          <div className="icon-meaning">
            <RestartAlt className="icon" />
            <span className="meaning">Restock drug</span>
          </div>
          <div className="icon-meaning">
            <ArrowForwardIos className="icon" />
            <span className="meaning">Open all drugs/sales page</span>
          </div>
          <div className="icon-meaning">
            <Close className="icon" />
            <span className="meaning">Close dialogue or cancle </span>
          </div>
          <div className="icon-meaning">
            <Delete className="icon" />
            <span className="meaning">Delete drug</span>
          </div>
          <div className="icon-meaning">
            <Edit className="icon" />
            <span className="meaning">Edit drug info</span>
          </div>
        </div>
      </div>
    </>
  );
};

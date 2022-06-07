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
            <span className="meaning">Add new item to store</span>
          </div>
          <div className="icon-meaning">
            <Visibility className="icon" />
            <span className="meaning">See item details</span>
          </div>
          <div className="icon-meaning">
            <CurrencyExchange className="icon" />
            <span className="meaning">Sell item</span>
          </div>
          <div className="icon-meaning">
            <RestartAlt className="icon" />
            <span className="meaning">Restock item</span>
          </div>
          <div className="icon-meaning">
            <ArrowForwardIos className="icon" />
            <span className="meaning">Open all items/sales page</span>
          </div>
          <div className="icon-meaning">
            <Close className="icon" />
            <span className="meaning">Close dialogue or cancle </span>
          </div>
          <div className="icon-meaning">
            <Delete className="icon" />
            <span className="meaning">Delete item</span>
          </div>
          <div className="icon-meaning">
            <Edit className="icon" />
            <span className="meaning">Edit item details</span>
          </div>
        </div>
      </div>
    </>
  );
};

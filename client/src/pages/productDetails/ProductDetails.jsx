import {
  CurrencyExchange,
  Delete,
  Edit,
  RestartAlt,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DataTable from "../../components/Table";
import { request } from "../../request";
import QuickStat from "./QuickStat";
import moment from "moment";
import Footer from '../../components/Footer'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { itemSalesColumn } from "../../data";
import FormDialog from "./EditItem";
import { useState } from "react";
import ResponsiveDialog from "../../components/Dialog";
import AlertComponent from "../../components/Alert";
import SellDial from "../dashboard/Sell";
import Navbar from "../../components/nav/Navbar";
import Loading from "../../components/Loading";
import { salesFailure, salesStart, salesSuccess } from "../../redux/sales";
import { useDispatch } from "react-redux";
import Restock from "../dashboard/Restock";
const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const storeId = localStorage.getItem("storeId");
  const item = useSelector((state) =>
    state.items.Items.find((item) => item.id === id)
  );
  const [openEdit, setOpenEdit] = useState(false);
  const [openRestock, setOpenRestock] = useState(false);
  const [stock, setStock] = useState(0);

  const salesHistory = useSelector((state) =>
    state.sales.Sales.filter((sale) => sale.item_id === id)
  );
  const [sales, setSales] = useState(salesHistory);
  let [totalSalesFigure, setTotalSalesFigure] = useState(
    salesHistory?.length > 1
      ? salesHistory?.reduce((a, b) => a.cost + b.cost)
      : salesHistory?.length === 1
      ? salesHistory[0].cost
      : 0
  );

  const salesToday = salesHistory?.filter(
    (sale) => sale?.createdAt?.indexOf(moment().format("DD/MM/YYYY")) > -1
  );
  let dailySalesFigures = [];
  salesToday?.forEach((sale) => dailySalesFigures.push(sale.cost));
  let [dailySalesFigure, setDailySalesFigure] = useState(
    dailySalesFigures.length > 0 ? dailySalesFigures.reduce((a, b) => a + b) : 0
  );
  const salesMonth = salesHistory?.filter(
    (sale) => sale?.createdAt?.indexOf(moment().format("/MM/YYYY")) > -1
  );
  let monthlySalesFigures = [];
  salesMonth?.forEach((sale) => monthlySalesFigures.push(sale.cost));
  let [monthlySalesFigure, setMonthlySalesFigure] = useState(
    monthlySalesFigures?.length > 0
      ? monthlySalesFigures?.reduce((a, b) => a + b)
      : 0
  );
  let salesYear = salesHistory?.filter(
    (sale) => sale?.createdAt?.indexOf(moment().format("/YYYY")) > -1
  );
  let annualSalesFigures = [];
  salesYear?.forEach((sale) => annualSalesFigures.push(sale.cost));
  let [annualSalesFigure, setAnnualSalesFigure] = useState(
    annualSalesFigures?.length > 0
      ? annualSalesFigures?.reduce((a, b) => a + b)
      : 0
  );
  const deleteItem = async () => {
    try {
      const res = await request.delete(`/items/${id}`);
      alert(res.data);
      window.location.href = "/";
    } catch (err) {}
  };
  // DIALOG INFO
  const [openDial, setOpenDial] = useState(false);
  // OPEN SELL DIAL
  const [openSell, setOpenSell] = useState(false);
  const [quantity, setQuantity] = useState(0);
  // ALERT INFO
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [message, setMessage] = useState("");
  // SELL DRUG
  const handleSellItem = async () => {
    if (!quantity || quantity < 1) {
      setSeverity("error");
      setMessage("Enter valid quantity");
      setOpenAlert(true);
    } else {
      const salesDetails = {
        storeId,
        item_name: item.name,
        item_id: id,
        cost: item.price * quantity,
        quantity,
        createdAt: moment().format("DD/MM/YYYY"),
        id: (Math.floor(Math.random() * 100000) + 100000)
          .toString()
          .substring(1),
      };
      try {
        const res = await request.post("/sales", salesDetails);
        setQuantity(0);
        setMessage(res.data);
        setOpenAlert(true);
        setDailySalesFigure(dailySalesFigure + salesDetails.cost);
        setMonthlySalesFigure(monthlySalesFigure + salesDetails.cost);
        setAnnualSalesFigure(annualSalesFigure + salesDetails.cost);
        setTotalSalesFigure(totalSalesFigure + salesDetails.cost);
        setSales([salesDetails, ...sales]);
      } catch (err) {
        setOpenAlert(true);
        setMessage(err.response.data);
        setSeverity("error");
      }
      setOpenSell(false);
    }
  };
  // RESTOCK
  const handleRestock = async () => {
    setLoading(true);
    if (!stock || stock < 1) {
      setSeverity("warning");
      setMessage("Enter valid stock number");
      setOpenAlert(true);
      setLoading(false);
    } else {
      try {
        const res = await request.put("/items/restock/" + id, {
          stock,
        });
        setMessage(res.data);
        setOpenRestock(false);
        setStock(0);
        setMessage(res.data);
        setSeverity("success");
      } catch (err) {
        setMessage(err.response.data);
        setSeverity("error");
      }
      setOpenAlert(true);
      setOpenRestock(false);
      setLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);
  // REFRESHING DATA
  const handleRefresh = async () => {
    setLoading(true);
    dispatch(salesStart());
    try {
      const sales = await request.get(`/sales?storeId=${storeId}`);
      dispatch(salesSuccess(sales.data));
      window.location.reload();
    } catch (err) {
      dispatch(salesFailure());
    }
    setLoading(false);
  };
  // jan
  const janSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/01/" + new Date().getFullYear()) > -1
  );
  let janFig = [];
  janSales.forEach((s) => janFig.push(s.cost));
  // feb
  const febSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/02/" + new Date().getFullYear()) > -1
  );
  let febFig = [];
  febSales.forEach((s) => febFig.push(s.cost));
  // mar
  const marSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/03/" + new Date().getFullYear()) > -1
  );
  let marFig = [];
  marSales.forEach((s) => marFig.push(s.cost));
  // apr
  const aprSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/04/" + new Date().getFullYear()) > -1
  );
  let aprFig = [];
  aprSales.forEach((s) => aprFig.push(s.cost));
  // may
  const maySales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/05/" + new Date().getFullYear()) > -1
  );
  let mayFig = [];
  maySales.forEach((s) => mayFig.push(s.cost));
  // jun
  const junSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/06/" + new Date().getFullYear()) > -1
  );
  let junFig = [];
  junSales.forEach((s) => junFig.push(s.cost));
  // jul
  const julSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/07/" + new Date().getFullYear()) > -1
  );
  let julFig = [];
  julSales.forEach((s) => julFig.push(s.cost));
  // aug
  const augSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/08/" + new Date().getFullYear()) > -1
  );
  let augFig = [];
  augSales.forEach((s) => augFig.push(s.cost));
  // sep
  const sepSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/09/" + new Date().getFullYear()) > -1
  );
  let sepFig = [];
  sepSales.forEach((s) => sepFig.push(s.cost));
  // oct
  const octSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/10/" + new Date().getFullYear()) > -1
  );
  let octFig = [];
  octSales.forEach((s) => octFig.push(s.cost));
  // nov
  const novSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/11/" + new Date().getFullYear()) > -1
  );
  let novFig = [];
  novSales.forEach((s) => novFig.push(s.cost));
  // dec
  const decSales = salesHistory.filter(
    (sale) => sale.createdAt.indexOf("/12/" + new Date().getFullYear()) > -1
  );
  let decFig = [];
  decSales.forEach((s) => decFig.push(s.cost));
  const data = [
    {
      name: "Jan",
      sales:
        janFig.length > 1
          ? janFig.reduce((a, b) => a + b)
          : janFig.length === 1
          ? janFig[0]
          : 0,
    },
    {
      name: "Feb",
      sales:
        febFig.length > 1
          ? febFig.reduce((a, b) => a + b)
          : febFig.length === 1
          ? febFig[0]
          : 0,
    },
    {
      name: "Mar",
      sales:
        marFig.length > 1
          ? marFig.reduce((a, b) => a + b)
          : marFig.length === 1
          ? marFig[0]
          : 0,
    },
    {
      name: "Apr",
      sales:
        aprFig.length > 1
          ? aprFig.reduce((a, b) => a + b)
          : aprFig.length === 1
          ? aprFig[0]
          : 0,
    },
    {
      name: "May",
      sales:
        mayFig.length > 1
          ? mayFig.reduce((a, b) => a + b)
          : mayFig.length === 1
          ? mayFig[0]
          : 0,
    },
    {
      name: "Jun",
      sales:
        junFig.length > 1
          ? junFig.reduce((a, b) => a + b)
          : junFig.length === 1
          ? junFig[0]
          : 0,
    },
    {
      name: "Jul",
      sales:
        julFig.length > 1
          ? julFig.reduce((a, b) => a + b)
          : julFig.length === 1
          ? julFig[0]
          : 0,
    },
    {
      name: "Aug",
      sales:
        augFig.length > 1
          ? augFig.reduce((a, b) => a + b)
          : augFig.length === 1
          ? augFig[0]
          : 0,
    },
    {
      name: "Sep",
      sales:
        sepFig.length > 1
          ? sepFig.reduce((a, b) => a + b)
          : sepFig.length === 1
          ? sepFig[0]
          : 0,
    },
    {
      name: "Oct",
      sales:
        octFig.length > 1
          ? octFig.reduce((a, b) => a + b)
          : octFig.length === 1
          ? octFig[0]
          : 0,
    },
    {
      name: "Nov",
      sales:
        novFig.length > 1
          ? novFig.reduce((a, b) => a + b)
          : novFig.length === 1
          ? novFig[0]
          : 0,
    },
    {
      name: "Dec",
      sales:
        decFig.length > 1
          ? decFig.reduce((a, b) => a + b)
          : decFig.length === 1
          ? decFig[0]
          : 0,
    },
  ];

  return (
    <>
      <Navbar refresh={() => handleRefresh()} />
      <Loading open={loading} />
      <AlertComponent
        open={openAlert}
        severity={severity}
        message={message}
        close={() => setOpenAlert(false)}
      />
      <ResponsiveDialog
        open={openDial}
        DialContent={`If you proceed with this action, ${item.name} will be deleted.`}
        title={`Delete ${item.name}`}
        handleClose={() => setOpenDial(false)}
        option1="Cancel"
        option2="Delete"
        event={() => deleteItem()}
      />
      <FormDialog open={openEdit} handleClose={() => setOpenEdit(false)} />
      <SellDial
        open={openSell}
        itemName={item.name}
        stock={item.stock}
        price={item.price}
        handleClose={() => setOpenSell(false)}
        quantity={quantity}
        quantityEvent={(e) => setQuantity(e.target.value)}
        handleSellItem={() => handleSellItem()}
      />
      <Restock
        openStock={openRestock}
        handleClose={() => setOpenRestock(false)}
        name={item?.name}
        restockEvent={(e) => setStock(e.target.value)}
        handleRestock={() => handleRestock()}
      />
      <div className="dashboard-container">
        <div className="dash-left">
          <QuickStat
            overallSales={totalSalesFigure}
            dailySales={dailySalesFigure}
            monthlySales={monthlySalesFigure}
            annualSales={annualSalesFigure}
          />
          <div className="items-container">
            <div className="items-top">
              <h1 className="heading">Item Sales history</h1>
              <div className="head-links">
                {new Date(item.expiry) > new Date() && (
                  <CurrencyExchange
                    className="icon-link mr10"
                    onClick={() => setOpenSell(true)}
                  />
                )}
                <RestartAlt
                  className="icon-link mr10"
                  onClick={() => {
                    setOpenRestock(true);
                  }}
                />
                <Edit className="icon-link" onClick={() => setOpenEdit(true)} />
                <Delete
                  className="icon-link"
                  onClick={() => setOpenDial(true)}
                />
              </div>
            </div>
            {sales && (
              <DataTable
                rows={[...sales]?.sort((a, b) =>
                  a.createdAt.toString() < b.createdAt.toString() ? 1 : -1
                )}
                columns={itemSalesColumn}
              />
            )}
          </div>
        </div>
        <div className="dash-right">
          <div className="dash-right-item-info mb20">
            <div className="item-info-top">
              <h1 className="heading">Item Details</h1>
              <button
                className="btn"
                onClick={() => setOpenSell(true)}
                disabled={new Date(item.expiry) < new Date()}
              >
                Sell
                <CurrencyExchange className="icon-link" />
              </button>
            </div>
            <div className="item-info-content">
              <div className="item-info-left">
                <div className="item-info-key-vale">
                  <span className="key">Name</span>:
                  <span className="value">{item?.name}</span>
                </div>
                <div className="item-info-key-vale">
                  <span className="key">Supplier</span>:
                  <span className="value">{item?.supplier}</span>
                </div>
                <div className="item-info-key-vale">
                  <span className="key">Price</span>:
                  <span className="value">&#8373;{item?.price}</span>
                </div>
                <div className="item-info-key-vale">
                  <span className="key">Stock</span>:
                  <span className="value">{item?.stock}</span>
                </div>
              </div>
              <div className="item-info-right">
                <div className="item-info-key-vale">
                  <span className="key">Status</span>:
                  <span className="value">
                    {new Date(item?.expiry) < new Date() ? (
                      <span className="expired">Expired</span>
                    ) : item.stock < 1 ? (
                      <span className="out-stock">Out of stock</span>
                    ) : (
                      <span className="active">Active</span>
                    )}
                  </span>
                </div>
                <div className="item-info-key-vale">
                  <span className="key">Implications</span>:
                  <span className="value">
                    {item.implications?.toString().replace(",", ", ")}
                  </span>
                </div>
                <div className="item-info-key-vale">
                  <span className="key">Dosage</span>:
                  <span className="value">{item?.dosage}</span>
                </div>
                <div className="item-info-key-vale">
                  <span className="key">Expiry</span>:
                  <span className="value">{item?.expiry}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="chart">
            <div className="dash-right-top">
              <h1 className="heading mb20">
                Annual Sales Performance Area Chart of {item?.name} in
                {moment().format(" yyyy")}
              </h1>
            </div>
            <AreaChart
              width={850}
              height={400}
              className="areaChart"
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#087a75"
                fillOpacity={1}
                fill="#30e6dd1b"
              />
            </AreaChart>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;

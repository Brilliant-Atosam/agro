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
import Footer from "../../components/Footer";
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
import { itemsStart, itemsFailure, itemsSuccess } from "../../redux/items";
import { useDispatch } from "react-redux";
import Restock from "../dashboard/Restock";
const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const store = useSelector((state) => state.store.Store);
  const storeId = localStorage.getItem("storeId");
  const Item = useSelector((state) =>
    state.items.Items.find((item) => item.id === id)
  );
  const [item, setItem] = useState(Item);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRestock, setOpenRestock] = useState(false);
  const [stock, setStock] = useState(0);

  const salesHistory = useSelector((state) =>
    state.sales.Sales.filter((sale) => sale.item_id === id)
  );
  const [sales, setSales] = useState(salesHistory);
  let [totalSalesFigure, setTotalSalesFigure] = useState(
    sales?.length > 1
      ? sales?.reduce((a, b) => a.cost + b.cost)
      : sales?.length === 1
      ? sales[0].cost
      : 0
  );

  const salesToday = sales?.filter(
    (sale) => sale?.createdAt?.indexOf(moment().format("DD/MM/YYYY")) > -1
  );
  let dailySalesFigures = [0, 0];
  salesToday?.forEach((sale) => dailySalesFigures.push(sale.cost));
  let [dailySalesFigure, setDailySalesFigure] = useState(
    dailySalesFigures.reduce((a, b) => a + b)
  );
  const salesMonth = sales?.filter(
    (sale) => sale?.createdAt?.indexOf(moment().format("/MM/YYYY")) > -1
  );
  let monthlySalesFigures = [0, 0];
  salesMonth?.forEach((sale) => monthlySalesFigures.push(sale.cost));
  let [monthlySalesFigure, setMonthlySalesFigure] = useState(
    monthlySalesFigures?.reduce((a, b) => a + b)
  );
  let salesYear = sales?.filter(
    (sale) => sale?.createdAt?.indexOf(moment().format("/YYYY")) > -1
  );
  let annualSalesFigures = [0, 0];
  salesYear?.forEach((sale) => annualSalesFigures.push(sale.cost));
  let [annualSalesFigure, setAnnualSalesFigure] = useState(
    annualSalesFigures?.reduce((a, b) => a + b)
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
        mode: store.mode,
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
  // EDIT ITEM
  const [name, setName] = useState(item.name);
  const [supplier, setSupplier] = useState(item.supplier);
  const [implications, setImplications] = useState(
    item.implications.toString()
  );
  const [expiry, setExpiry] = useState(item.expiry);
  const [dosage, setDosage] = useState(item.dosage);
  const [price, setPrice] = useState(item.price);
  const [loading, setLoading] = useState(false);
  const handleEdit = async () => {
    const itemDetails = {
      name,
      supplier,
      implications: implications.split(", "),
      dosage,
      price,
      expiry: moment(expiry).format("MM/DD/YYYY"),
      id,
    };
    try {
      const res = await request.put(`/items/${id}`, itemDetails);
      setItem({
        name,
        supplier,
        implications: implications.split(", "),
        dosage,
        price,
        expiry,
        stock: item.stock,
      });
      setOpenAlert(true);
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response.data);
      setSeverity("error");
    }
  };
  // REFRESHING DATA
  const handleRefresh = async () => {
    setLoading(true);
    dispatch(salesStart());
    dispatch(itemsStart());
    try {
      const sales = await request.get(`/sales?storeId=${storeId}`);
      await dispatch(salesSuccess(sales.data));
      await setSales(sales.data.filter((sale) => sale.id === id));
      const items = await request.get(`/items?storeId=${storeId}`);
      await setItem(items.data.find((item) => item.id === id));
      await dispatch(itemsSuccess(items.data));
      window.location.href = '/'
    } catch (err) {
      dispatch(salesFailure());
      dispatch(itemsFailure());
      setOpenAlert(true);
      setSeverity("error");
      setMessage(err.response.data);
    }
    setLoading(false);
  };
  // jan
  const janSales = sales.filter(
    (sale) => sale.createdAt.indexOf("/01/" + new Date().getFullYear()) > -1
  );
  let janFig = [];
  janSales.forEach((s) => janFig.push(s.cost));
  // feb
  const febSales = sales.filter(
    (sale) => sale.createdAt.indexOf("/02/" + new Date().getFullYear()) > -1
  );
  let febFig = [];
  febSales.forEach((s) => febFig.push(s.cost));
  // mar
  const marSales = sales.filter(
    (sale) => sale.createdAt.indexOf("/03/" + new Date().getFullYear()) > -1
  );
  let marFig = [];
  marSales.forEach((s) => marFig.push(s.cost));
  // apr
  const aprSales = sales.filter(
    (sale) => sale.createdAt.indexOf("/04/" + new Date().getFullYear()) > -1
  );
  let aprFig = [];
  aprSales.forEach((s) => aprFig.push(s.cost));
  // may
  const maySales = sales.filter(
    (sale) => sale.createdAt.indexOf("/05/" + new Date().getFullYear()) > -1
  );
  let mayFig = [];
  maySales.forEach((s) => mayFig.push(s.cost));
  // jun
  const junSales = sales.filter(
    (sale) => sale.createdAt.indexOf("/06/" + new Date().getFullYear()) > -1
  );
  let junFig = [];
  junSales.forEach((s) => junFig.push(s.cost));
  // jul
  const julSales = sales.filter(
    (sale) => sale.createdAt.indexOf("/07/" + new Date().getFullYear()) > -1
  );
  let julFig = [];
  julSales.forEach((s) => julFig.push(s.cost));
  // aug
  const augSales = sales.filter(
    (sale) => sale.createdAt.indexOf("/08/" + new Date().getFullYear()) > -1
  );
  let augFig = [];
  augSales.forEach((s) => augFig.push(s.cost));
  // sep
  const sepSales = sales.filter(
    (sale) => sale.createdAt.indexOf("/09/" + new Date().getFullYear()) > -1
  );
  let sepFig = [];
  sepSales.forEach((s) => sepFig.push(s.cost));
  // oct
  const octSales = sales.filter(
    (sale) => sale.createdAt.indexOf("/10/" + new Date().getFullYear()) > -1
  );
  let octFig = [];
  octSales.forEach((s) => octFig.push(s.cost));
  // nov
  const novSales = sales.filter(
    (sale) => sale.createdAt.indexOf("/11/" + new Date().getFullYear()) > -1
  );
  let novFig = [];
  novSales.forEach((s) => novFig.push(s.cost));
  // dec
  const decSales = sales.filter(
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
      <FormDialog
        open={openEdit}
        name={name}
        handleClose={() => setOpenEdit(false)}
        nameEvent={(e) => setName(e.target.value)}
        supplier={supplier}
        implications={implications}
        price={price}
        dosage={dosage}
        supplierEvent={(e) => setSupplier(e.target.value)}
        implicationsEvent={(e) => setImplications(e.target.value)}
        priceEvent={(e) => setPrice(e.target.value)}
        dossageEvent={(e) => setDosage(e.target.value)}
        expiryEvent={(e) => setExpiry(e.target.value)}
        handleEdit={() => handleEdit()}
      />
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
            overallSales={store.mode === "Admin" ? totalSalesFigure : "..."}
            dailySales={dailySalesFigure}
            monthlySales={store.mode === "Admin" ? monthlySalesFigure : "..."}
            annualSales={store.mode === "Admin" ? annualSalesFigure : "..."}
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
                    store.mode !== "Admin"
                      ? alert(
                          "You don't have the privilege to perform this task"
                        )
                      : setOpenRestock(true);
                  }}
                />
                <Edit
                  className="icon-link"
                  onClick={() => {
                    store.mode !== "Admin"
                      ? alert(
                          "You don't have the privilege to perform this task"
                        )
                      : setOpenEdit(true);
                  }}
                />
                <Delete
                  className="icon-link"
                  onClick={() => {
                    store.mode !== "Admin"
                      ? alert(
                          "You don't have the privilege to perform this task"
                        )
                      : setOpenDial(true);
                  }}
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
                    {new Date(expiry) < new Date() ? (
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
              data={store.mode === "Admin" ? data : 0}
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

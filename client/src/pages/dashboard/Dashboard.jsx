import "./dashboard.css";
import Navbar from "../../components/nav/Navbar";
import {
  ArrowForwardIos,
  MedicalServices,
  Visibility,
  CurrencyExchange,
  RestartAlt,
  Search,
  Close,
} from "@mui/icons-material";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "../../components/Table";
import AddItemForm from "./AddItem";
import { itemsStart, itemsSuccess, itemsFailure } from "../../redux/items";
import { salesStart, salesSuccess, salesFailure } from "../../redux/sales";
import { useState, useEffect } from "react";
import { request } from "../../request";
import { Link } from "react-router-dom";
import QuickStat from "./QuickStat";
import Restock from "./Restock";
import AlertComponent from "../../components/Alert";
import { salesColumn } from "../../data";
import Loading from "../../components/Loading";
import SellItemForm from "./Sell";
import SnackbarAlert from "../../components/Snackback";
const Dashboard = () => {
  const dispatch = useDispatch();
  const storeId = localStorage.getItem("storeId");
  const [loading, setLoading] = useState(false);
  // REFRESHING DATA
  const handleRefresh = async () => {
    setLoading(true);
    dispatch(itemsStart());
    dispatch(salesStart());
    try {
      const items = await request.get(`/items?storeId=${storeId}`);
      dispatch(itemsSuccess(items.data));
      const sales = await request.get(`/sales?storeId=${storeId}`);
      dispatch(salesSuccess(sales.data));
      window.location.reload();
    } catch (err) {
      dispatch(itemsFailure());
      dispatch(salesFailure());
    }
    setLoading(false);
  };
  const allItems = useSelector((state) => state.items.Items);
  const allSales = useSelector((state) => state.sales.Sales);
  const store = useSelector((state) => state.store.Store);
  useEffect(() => {
    store.lastVerified === undefined && (window.location.href = "/sub");
    new Date(store.nextVerification) < new Date() &&
      (window.location.href = "/renew");
  }, [store]);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(allItems);
  const [sales, setSales] = useState(allSales);
  const [itemsNum, setItemsNum] = useState(items?.length);
  const [openSnack, setOpenSnack] = useState(false);
  const salesToday = sales?.filter(
    (sale) => sale.createdAt?.indexOf(moment().format("DD/MM/YYYY")) > -1
  );
  let salesTodayFigures = [];
  salesToday?.forEach((sale) => salesTodayFigures.push(sale.cost));

  const [dailySales, setDailySales] = useState(
    salesTodayFigures.length > 0 ? salesTodayFigures.reduce((a, b) => a + b) : 0
  );

  const salesMonth = sales?.filter(
    (sale) => sale?.createdAt?.indexOf(moment().format("MM/YYYY")) > -1
  );
  let monthlySalesFigures = [];
  salesMonth?.forEach((sale) => monthlySalesFigures.push(sale.cost));

  const [monthlySales, setMonthlySales] = useState(
    monthlySalesFigures.length > 0
      ? monthlySalesFigures.reduce((a, b) => a + b)
      : 0
  );
  const [openSell, setOpenSell] = useState(false);
  const [openStock, setOpenStock] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState("");
  const [stock, setStock] = useState();
  const [price, setPrice] = useState();
  const [supplier, setSupplier] = useState("");
  const [implications, setImplications] = useState("");
  const [dosage, setDosage] = useState("");
  const [expiry, setExpiry] = useState("");
  const [id, setId] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [message, setMessage] = useState("");
  // ADD DRUG FORM
  const [openAdd, setOpenAdd] = useState(false);
  // ADD DRUG
  const handleAdd = async () => {
    setLoading(true);
    const itemDetails = {
      storeId,
      name,
      stock,
      supplier,
      implications: implications.split(", "),
      dosage,
      price,
      expiry: moment(expiry).format("MM/DD/YYYY"),
      id: (Math.floor(Math.random() * 100000) + 100000).toString().substring(1),
    };
    if (!name || !stock || !price) {
      setOpenSnack(true);
      setMessage("Provide valid data for name, stock or price");
      setLoading(false);
    } else if (new Date(expiry) < new Date()) {
      setMessage("Can't add expired item");
      setOpenSnack(true);
      setSeverity("warning");
      setLoading(false);
    } else {
      try {
        setOpenSnack(true);
        const res = await request.post("/items", itemDetails);
        setItems([itemDetails, ...items]);
        setItemsNum(itemsNum + 1);
        setMessage(res.data);
        setName("");
        setDosage("");
        setPrice("");
        setExpiry("");
        setStock(0);
        setImplications("");
        setLoading(false);
      } catch (err) {
        setMessage(err.response.data);
        setLoading(false);
      }
    }
  };
  // SELL DRUG
  const sellItem = async () => {
    if (!quantity || quantity < 1) {
      setSeverity("error");
      setMessage("Enter valid quantity");
      setOpenSnack(true);
    } else {
      const salesDetails = {
        storeId,
        item_name: name,
        item_id: id,
        cost: price * quantity,
        quantity,
        createdAt: moment().format("DD/MM/YYYY h:mm:ss"),
        id: (Math.floor(Math.random() * 100000) + 100000)
          .toString()
          .substring(1),
      };
      try {
        const res = await request.post("/sales", salesDetails);
        setQuantity(0);
        setSales([salesDetails, ...sales]);
        setDailySales(dailySales + salesDetails.cost);
        setMonthlySales(monthlySales + salesDetails.cost);
        setMessage(res.data);
        setOpenSnack(true);
      } catch (err) {
        setOpenSnack(true);
        setMessage(err.response.data);
        setSeverity("error");
      }
      setOpenSell(false);
    }
  };
  const itemsColumn = [
    {
      field: "name",
      headerName: "Item",
      width: 200,
      renderCell: (params) => (
        <p
          className={
            new Date(params.row.expiry) <= new Date()
              ? "expired"
              : params.row.stock < 0
              ? "out-stock"
              : "item-name"
          }
        >
          {params.row.name}
        </p>
      ),
    },
    {
      headerName: "Action",
      width: 170,
      renderCell: (params) => (
        <div className="action-btn">
          <Link to={`/items/${params.row.id}`}>
            <Visibility className="action-icon" />
          </Link>

          <RestartAlt
            className="action-icon "
            onClick={() => {
              setName(params.row.name);
              setId(params.row.id);
              setExpiry(params.row.expiry);
              setOpenStock(true);
            }}
          />
          {new Date(params.row.expiry) > new Date() && (
            <CurrencyExchange
              className={params.row.stock < 1 ? "no-show" : `action-icon`}
              onClick={() => {
                setName(params.row.name);
                setPrice(params.row.price);
                setId(params.row.id);
                setOpenSell(true);
                setStock(params.row.stock);
              }}
            />
          )}
        </div>
      ),
    },

    { field: "price", headerName: "Price", width: 100 },
    { field: "stock", headerName: "Stock", width: 130 },
    { field: "id", headerName: "ID", width: 70 },
    {
      headerName: "Status",
      field: "expiry",
      width: 100,
      renderCell: (params) => (
        <>
          {new Date(params.row.expiry) < new Date() ? (
            <span className="expired">Expired</span>
          ) : params.row.stock < 1 ? (
            <span className="out-stock">Out of Stock</span>
          ) : (
            <span className="active">Active</span>
          )}
        </>
      ),
    },
  ];

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
        setOpenStock(false);
        setStock(0);
        setMessage(res.data);
        setSeverity("success");
      } catch (err) {
        setMessage(err.response.data);
        setSeverity("error");
      }
      setOpenAlert(true);
      setOpenStock(false);
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar refresh={() => handleRefresh()} />
      <Loading open={loading} />
      <AlertComponent
        open={openAlert}
        severity={severity}
        message={message}
        close={() => {
          setOpenAlert(false);
        }}
      />
      {/* ADD DRUG FORM */}

      <AddItemForm
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
        nameEvent={(e) => setName(e.target.value)}
        stockEvent={(e) => setStock(e.target.value)}
        supplierEvent={(e) => setSupplier(e.target.value)}
        implicationsEvent={(e) => setImplications(e.target.value)}
        priceEvent={(e) => setPrice(e.target.value)}
        dosageEvent={(e) => setDosage(e.target.value)}
        expiryEvent={(e) => setExpiry(e.target.value)}
        handleAdd={() => handleAdd()}
      />
      <Restock
        openStock={openStock}
        handleClose={() => setOpenStock(false)}
        name={name}
        restockEvent={(e) => setStock(e.target.value)}
        handleRestock={() => handleRestock()}
      />
      <SellItemForm
        open={openSell}
        quantity={quantity}
        handleClose={() => setOpenSell(false)}
        itemName={name}
        price={price}
        quantityEvent={(e) => setQuantity(e.target.value)}
        handleSellItem={() => sellItem()}
        stock={stock}
      />
      <SnackbarAlert
        open={openSnack}
        message={message}
        severity={severity}
        handleClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setOpenSnack(false);
        }}
      />
      <div className="dashboard-container">
        <div className="dash-left">
          <QuickStat
            itemsNum={itemsNum}
            outStock={items?.filter((item) => item.stock < 1).length}
            dailySales={dailySales}
            expired={
              items?.filter((item) => new Date(item.expiry) <= new Date())
                .length
            }
            nextSub={moment(store.nextVerification).format('DD-MM-YY')}
          />

          <div className="items-container">
            <div className="nav-center">
              <input
                type="text"
                placeholder="Search item"
                className="search-input"
                onChange={(e) => {
                  setSearch(e.target.value);
                  setItems(
                    allItems?.filter(
                      (item) =>
                        item.name &&
                        item.name
                          .toLowerCase()
                          .indexOf(e.target.value.toLowerCase()) > -1
                    )
                  );
                }}
                value={search}
              />
              <div className="search-icons">
                {search && (
                  <Close
                    className="search-icon"
                    onClick={() => {
                      setSearch("");
                      setItems(allItems);
                    }}
                  />
                )}
                <Search className="search-icon" />
              </div>
            </div>
            <div className="items-top">
              <h1 className="heading">Items</h1>
              <div className="head-links">
                <MedicalServices
                  className="icon-link mr10"
                  onClick={() => setOpenAdd(true)}
                />
                <Link to="/items">
                  <ArrowForwardIos className="icon-link" />
                </Link>
              </div>
            </div>
            <DataTable
              rows={[...items]?.sort((a, b) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
              )}
              columns={itemsColumn}
            />
          </div>
        </div>
        <div className="dash-right chart">
          <div className="sales-top">
            <h1 className="heading">Sales</h1>
            <Link to="/sales">
              <ArrowForwardIos className="icon-link" />
            </Link>
          </div>
          <DataTable
            rows={[...sales]?.sort((a, b) =>
              a.createdAt.toString() > b.createdAt.toString() ? -1 : 1
            )}
            columns={salesColumn}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

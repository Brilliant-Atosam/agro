import {
  ArrowForwardIos,
  MedicalServices,
  CurrencyExchange,
  Add,
  Visibility,
  Close,
  Search,
  RestartAlt,
} from "@mui/icons-material";
import Footer from "../../components/Footer";
import SnackbarAlert from "../../components/Snackback";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "../../components/Table";
import { itemsStart, itemsSuccess, itemsFailure } from "../../redux/items";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { request } from "../../request";
import { Link } from "react-router-dom";
import Restock from "../dashboard/Restock";
import Navbar from "../../components/nav/Navbar";
import Loading from "../../components/Loading";
import AlertComponent from "../../components/Alert";
import SellItemForm from "../dashboard/Sell";
import AddItemForm from "../dashboard/AddItem";
import QuickStat from "./QuickStat";
const Items = () => {
  const store = useSelector((state) => state.store.Store);
  const storeId = localStorage.getItem("storeId");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(itemsStart);
    try {
      const fetchData = async () => {
        const items = await request.get(`/items?storeId=${storeId}`);
        dispatch(itemsSuccess(items.data));
      };
      fetchData();
    } catch (err) {
      dispatch(itemsFailure(err.response.data));
    }
  }, [dispatch, storeId]);
  const [openAdd, setOpenAdd] = useState(false);
  const allItems = useSelector((state) => state.items.Items);
  const [items, setItems] = useState(allItems);
  const [search, setSearch] = useState("");
  const [openSell, setOpenSell] = useState(false);
  const [openStock, setOpenStock] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState("");
  const [stock, setStock] = useState();
  const [price, setPrice] = useState();
  const [id, setId] = useState("");
  const [expiry, setExpiry] = useState("");
  const [supplier, setSupplier] = useState("");
  const [implications, setImplications] = useState("");
  const [dosage, setDosage] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [message, setMessage] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [itemsNum, setItemsNum] = useState(items?.length);
  const outStock = items?.filter((item) => item.stock === 0).length;
  const expired = items?.filter(
    (item) => new Date(item.expiry) < new Date()
  ).length;
  const active = itemsNum - expired - outStock;
  //   ADD DRUG
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
  //   SELL DRUG
  const sellItem = async () => {
    if (!quantity || quantity < 1) {
      setSeverity("error");
      setMessage("Enter valid quantity");
      setOpenAlert(true);
    } else {
      const salesDetails = {
        item_name: name,
        item_id: id,
        cost: price * quantity,
        quantity,
        storeId,
        createdAt: moment().format("DD/MM/YYYY h:mm:ss"),
        id: (Math.floor(Math.random() * 100000) + 100000)
          .toString()
          .substring(1),
        mode: store.mode,
      };
      try {
        const res = await request.post("/sales", salesDetails);
        setQuantity(0);
        setMessage(res.data);
        setOpenAlert(true);
        setSeverity("success");
      } catch (err) {
        setOpenAlert(true);
        setMessage(err.response.data);
        setSeverity("error");
      }
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
    try {
      const res = await request.put("/items/restock/" + id, { stock });
      setMessage(res.data);
      setSeverity("success");
      setOpenAlert(true);
      setOpenStock(false);
      setStock(0);
    } catch (err) {
      setMessage(err.response.data);
      setSeverity("error");
      setOpenAlert(true);
    }
  };
  const [loading, setLoading] = useState(false);
  // REFRESHING DATA
  const handleRefresh = async () => {
    setLoading(true);
    dispatch(itemsStart());
    try {
      const items = await request.get(`/items?storeId=${storeId}`);
      dispatch(itemsSuccess(items.data));
      window.location.reload();
    } catch (err) {
      dispatch(itemsFailure());
    }
    setLoading(false);
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
      <Restock
        openStock={openStock}
        handleClose={() => setOpenStock(false)}
        name={name}
        restockEvent={(e) => setStock(e.target.value)}
        resetExpiry={(e) => setExpiry(e.target.value)}
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
      <SnackbarAlert
        open={openSnack}
        message={message}
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
            outStock={outStock}
            expired={expired}
            active={active}
          />
          <div className="items-container items-page">
            <div className="add-item-form">
              <h1 className="heading">Add new item</h1>
              <TextField
                margin="dense"
                label="Item name"
                type="text"
                fullWidth
                variant="outlined"
                className="dial-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="dense"
                label="stock"
                type="number"
                fullWidth
                variant="outlined"
                className="dial-input"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Supplier"
                type="text"
                fullWidth
                variant="outlined"
                className="dial-input"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
              <TextField
                margin="dense"
                onChange={(e) => setImplications(e.target.value)}
                label="Implications"
                type="text"
                value={implications}
                fullWidth
                variant="outlined"
                className="dial-input"
              />
              <TextField
                margin="dense"
                onChange={(e) => setPrice(e.target.value)}
                label="Price"
                type="number"
                fullWidth
                variant="outlined"
                value={price}
                className="dial-input"
              />
              <TextField
                margin="dense"
                label="Dosage"
                type="text"
                fullWidth
                variant="outlined"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="dial-input"
              />
              <TextField
                margin="dense"
                label="Dosage"
                type="date"
                fullWidth
                variant="outlined"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="dial-input"
              />
              <button
                className="btn add-item-btn mt10"
                onClick={() => handleAdd()}
                disabled={store.mode !== "Admin"}
              >
                <Add className="mr10" /> Add Item
              </button>
            </div>
          </div>
        </div>
        <div className="dash-right chart">
          <div className="nav-center">
            <input
              type="text"
              placeholder="Search item"
              className="search-input"
              onChange={(e) => {
                setSearch(e.target.value);
                setItems(
                  allItems.filter(
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
                onClick={() => {
                  store.mode !== "Admin"
                    ? alert("You't have the privilege to perform this task!")
                    : setOpenAdd(true);
                }}
              />
              <Link to="/items">
                <ArrowForwardIos className="icon-link" />
              </Link>
            </div>
          </div>
          <DataTable
            rows={[...items].sort((a, b) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            )}
            columns={itemsColumn}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Items;

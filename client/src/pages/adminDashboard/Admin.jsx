import "./dashboard.css";
import Navbar from "../../components/nav/NavbarAdmin";
import {
  ArrowForwardIos,
  RestartAlt,
  Search,
  Close,
  Delete,
  Check,
} from "@mui/icons-material";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "../../components/Table";

import { useState } from "react";
import { request } from "../../request";
import { Link } from "react-router-dom";
import QuickStat from "./QuickStat";
import Loading from "../../components/Loading";
import SnackbarAlert from "../../components/Snackback";
import {
  clientsFailure,
  clientsStart,
  clientsSuccess,
} from "../../redux/clients";
import ResponsiveDialog from "../../components/Dialog";
const Admin = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [phone, setPhone] = useState();
  const [message, setMessage] = useState("");
  const [event, setEvent] = useState();
  // delete store
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await request.delete(`/store?id=${id}`);
      setOpenSnack(true);
      setMessage(res.data);
      setClients(clients.filter((client) => client.id !== id));
    } catch (err) {
      setOpenSnack(true);
      setMessage(err.response.data);
    }
    setOpen(false);
    setLoading(false);
  };
  // reset password
  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await request.put(`/store/password/reset?id=${id}`, {
        password: phone,
      });
      setOpenSnack(true);
      setMessage(res.data);
    } catch (err) {
      setOpenSnack(true);
      setMessage(err.response.data);
    }
    setOpen(false);
    setLoading(false);
  };
  // REFRESHING DATA
  const handleRefresh = async () => {
    setLoading(true);
    dispatch(clientsStart());
    try {
      const clients = await request.get(`/store`);
      dispatch(clientsSuccess(clients.data));
      window.location.reload();
    } catch (err) {
      dispatch(clientsFailure());
    }
    setLoading(false);
  };

  const allClients = useSelector((state) => state.clients.Clients);
  const [clients, setClients] = useState(allClients);
  const [search, setSearch] = useState("");
  const clientsNum = clients?.length;
  const [openSnack, setOpenSnack] = useState(false);
  const clientsToday = clients?.filter(
    (client) => client.createdAt?.indexOf(moment().format("DD/MM/YYYY")) > -1
  ).length;

  const clientsColumn = [
    { field: "id", headerName: "Store ID", width: 120 },
    {
      field: "name",
      headerName: "Store Name",
      width: 300,
      renderCell: (params) => (
        <p
          className={
            new Date(params.row.nextVerification) <= new Date()
              ? "expired"
              : "drug-name"
          }
        >
          {params.row.name}
        </p>
      ),
    },

    { field: "phone", headerName: "Contact No.", width: 220 },

    {
      headerName: "Status",
      field: "password",
      width: 150,
      renderCell: (params) => (
        <>
          {new Date(params.row.nextVerification) < new Date() ? (
            <span className="expired">Inactive</span>
          ) : (
            <span className="active">Active</span>
          )}
        </>
      ),
    },
    { field: "nextVerification", headerName: "Renewal", width: 150 },
    {
      headerName: "Action",
      width: 170,
      renderCell: (params) => (
        <div className="action-btn">
          <RestartAlt
            className="action-icon "
            onClick={() => {
              setId(params.row.id);
              setPhone(params.row.phone);
              setEvent("reset");
              setTitle("RESET PASSWORD");
              setContent(
                `If you continue with this operation, store with ID: ${id} will reset its password to phone`
              );
              setOpen(true);
            }}
          />

          <Delete
            className="action-icon"
            onClick={() => {
              setTitle("STORE DELETION");
              setContent(
                `If you continue with this operation, store with ID: ${id}`
              );
              setOpen(true);
              setId(params.row.id);
              setEvent("delete");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar refresh={() => handleRefresh()} />
      <Loading open={loading} />
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
      <ResponsiveDialog
        open={open}
        handleClose={() => setOpen(false)}
        title={title}
        DialContent={content}
        option1={<Close className="cancel" />}
        option2={<Check />}
        event={() => (event === "delete" ? handleDelete() : handleReset())}
      />
      <div className="dashboard-container">
        <div className="dash-left">
          <QuickStat
            drugsNum={clientsNum}
            dailySales={clientsToday}
            outStock={
              clients?.filter(
                (client) => new Date(client.nextVerification) > new Date()
              ).length
            }
            expired={
              clients?.filter(
                (client) => new Date(client.nextVerification) <= new Date()
              ).length
            }
          />

          <div className="drugs-container">
            <div className="nav-center">
              <input
                type="text"
                placeholder="Search client by ID"
                className="search-input"
                onChange={(e) => {
                  setSearch(e.target.value);
                  setClients(
                    clients?.filter(
                      (client) =>
                        client.id &&
                        client.id
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
                      setClients(allClients);
                    }}
                  />
                )}
                <Search className="search-icon" />
              </div>
            </div>
            <div className="drugs-top">
              <h1 className="heading">Clients</h1>
              <div className="head-links">
                <Link to="/drugs">
                  <ArrowForwardIos className="icon-link" />
                </Link>
              </div>
            </div>
            <DataTable rows={clients} columns={clientsColumn} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;

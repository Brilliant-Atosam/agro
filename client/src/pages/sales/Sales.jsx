import DataTable from "../../components/Table";
import { salesColumn } from "../../data";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import moment from "moment";
import { useSelector } from "react-redux";
import QuickStat from "./QuickStat";
import Navbar from "../../components/nav/Navbar";
import Loading from "../../components/Loading";
import { salesFailure, salesStart, salesSuccess } from "../../redux/sales";
import { request } from "../../request";
import { useState } from "react";
import { useDispatch } from "react-redux";
const Sales = () => {
  const storeId = localStorage.getItem("storeId");
  const dispatch = useDispatch();
  const salesRecords = useSelector((state) => state.sales.Sales);
  const dailySales = salesRecords?.filter(
    (sale) => sale.createdAt?.indexOf(moment().format("DD/MM/YYYY")) > -1
  );
  let salesTodayFigures = [];
  dailySales?.forEach((sale) => salesTodayFigures.push(sale.cost));
  const dailySalesFigure =
    salesTodayFigures.length > 0
      ? salesTodayFigures.reduce((a, b) => a + b)
      : 0;
  const salesMonth = salesRecords?.filter(
    (sale) => sale?.createdAt?.indexOf(moment().format("/MM/YYYY")) > -1
  );
  let monthlySalesFigures = [];
  salesMonth?.forEach((sale) => monthlySalesFigures.push(sale.cost));

  const monthlySalesFigure =
    monthlySalesFigures.length > 0
      ? monthlySalesFigures.reduce((a, b) => a + b)
      : 0;
  const salesYear = salesRecords?.filter(
    (sale) => sale?.createdAt?.indexOf(moment().format("/YYYY")) > -1
  );
  let annualSalesFigures = [];
  salesYear?.forEach((sale) => annualSalesFigures.push(sale.cost));
  const annualSalesFigure =
    annualSalesFigures.length > 0
      ? annualSalesFigures.reduce((a, b) => a + b)
      : 0;
  let totalSalesFigures = [];
  salesRecords.forEach((sale) => totalSalesFigures.push(sale.cost));
  const totalSalesFigure =
    totalSalesFigures.length > 0
      ? totalSalesFigures.reduce((a, b) => a + b)
      : 0;
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
  };
  // jan
  const janSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/01/" + new Date().getFullYear()) > -1
  );
  let janFig = [];
  janSales.forEach((s) => janFig.push(s.cost));
  // feb
  const febSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/02/" + new Date().getFullYear()) > -1
  );
  let febFig = [];
  febSales.forEach((s) => febFig.push(s.cost));
  // mar
  const marSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/03/" + new Date().getFullYear()) > -1
  );
  let marFig = [];
  marSales.forEach((s) => marFig.push(s.cost));
  // apr
  const aprSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/04/" + new Date().getFullYear()) > -1
  );
  let aprFig = [];
  aprSales.forEach((s) => aprFig.push(s.cost));
  // may
  const maySales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/05/" + new Date().getFullYear()) > -1
  );
  let mayFig = [];
  maySales.forEach((s) => mayFig.push(s.cost));
  // jun
  const junSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/06/" + new Date().getFullYear()) > -1
  );
  let junFig = [];
  junSales.forEach((s) => junFig.push(s.cost));
  // jul
  const julSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/07/" + new Date().getFullYear()) > -1
  );
  let julFig = [];
  julSales.forEach((s) => julFig.push(s.cost));
  // aug
  const augSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/08/" + new Date().getFullYear()) > -1
  );
  let augFig = [];
  augSales.forEach((s) => augFig.push(s.cost));
  // sep
  const sepSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/09/" + new Date().getFullYear()) > -1
  );
  let sepFig = [];
  sepSales.forEach((s) => sepFig.push(s.cost));
  // oct
  const octSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/10/" + new Date().getFullYear()) > -1
  );
  let octFig = [];
  octSales.forEach((s) => octFig.push(s.cost));
  // nov
  const novSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/11/" + new Date().getFullYear()) > -1
  );
  let novFig = [];
  novSales.forEach((s) => novFig.push(s.cost));
  // dec
  const decSales = salesRecords?.filter(
    (sale) => sale.createdAt.indexOf("/12/" + new Date().getFullYear()) > -1
  );
  let decFig = [];
  decSales.forEach((s) => decFig.push(s.cost));
  console.log(decFig);
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
      <div className="dashboard-container">
        <Loading open={loading} />
        <div className="dash-left">
          <QuickStat
            dailySales={dailySalesFigure}
            monthlySales={monthlySalesFigure}
            annualSales={annualSalesFigure}
            overallSales={totalSalesFigure}
          />
          <div className="drugs-container">
            <div className="drugs-top">
              <h1 className="heading">
                Sales History as at <b>{moment().format("dddd DD-MM-yy")}</b>
              </h1>
            </div>
            {
              <DataTable
                rows={[...salesRecords]?.sort((a, b) =>
                  a.createdAt.toString() > b.createdAt.toString() ? -1 : 1
                )}
                columns={salesColumn}
              />
            }
          </div>
        </div>
        <div className="dash-right chart">
          <div className="dash-right-top">
            <h1 className="heading mb20">
              Annual Sales Performance Area Chart for {moment().format("yyyy")}
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
    </>
  );
};

export default Sales;

import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  LockClock,
  MoreTimeSharp,
  Timer,
  TimerSharp,
} from "@mui/icons-material";
const QuickStat = ({ itemsNum, outStock, dailySales, expired, nextSub }) => {
  return (
    <div className="quick-stat">
      <div className="quick-stat-header">
        <h1 className="heading">Quick Stat</h1>
        <div className="quick-stat-header-left">
          <h1 className="heading">
            Store Id: <b>{localStorage.getItem("storeId")}</b>
          </h1>
          <span className="heading timer">
            <TimerSharp />:{nextSub}
          </span>
        </div>
      </div>
      <div className="quick-stat-container">
        <div className="quick-stat-item">
          <span className="number">{itemsNum}</span>
          <span className="desc">items</span>
        </div>
        <div className="quick-stat-item">
          <span className="number">{outStock}</span>
          <span className="desc">out stock</span>
        </div>
        <div className="quick-stat-item">
          <span className="number">
            <b>{expired}</b>
          </span>
          <span className="desc">Expired</span>
        </div>
        <div className="quick-stat-item">
          <span className="number">
            <b>&#8373;{dailySales}</b>
          </span>
          <span className="desc">{moment().format("ddd, D MMM")}</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStat;

import moment from "moment";
const QuickStat = ({ drugsNum, outStock, dailySales, expired, nextSub }) => {
  return (
    <div className="quick-stat">
      <div className="quick-stat-header">
        <h1 className="heading">Quick Stat</h1>
      </div>
      <div className="quick-stat-container">
        <div className="quick-stat-item">
          <span className="number">{drugsNum}</span>
          <span className="desc">Clients</span>
        </div>
        <div className="quick-stat-item">
          <span className="number">{outStock}</span>
          <span className="desc">Active</span>
        </div>
        <div className="quick-stat-item">
          <span className="number">
            <b>{expired}</b>
          </span>
          <span className="desc">Inactive</span>
        </div>
        <div className="quick-stat-item">
          <span className="number">
            <b>{dailySales}</b>
          </span>
          <span className="desc">{moment().format("ddd, D MMM")}</span>
        </div>
      </div>
    </div>
  );
};
export default QuickStat;

import moment from "moment";

const QuickStat = ({ dailySales, monthlySales, annualSales, overallSales }) => {
  return (
    <div className="quick-stat">
     <div className="quick-stat-header">
        <h1 className="heading">Sales Overview</h1>
        <h1 className="heading">
          Store Id: <b>{localStorage.getItem("storeId")}</b>
        </h1>
      </div>
      <div className="quick-stat-container">
        <div className="quick-stat-item">
          <span className="number">&#8373;{dailySales}</span>
          <span className="desc">{moment().format('ddd, DD MMM')}</span>
        </div>
        <div className="quick-stat-item">
          <span className="number">&#8373;{monthlySales}</span>
          <span className="desc">{moment().format('MMM, YYYY')}</span>
        </div>
        <div className="quick-stat-item">
          <span className="number">&#8373;{annualSales}</span>
          <span className="desc">{moment().format('YYYY')}</span>
        </div>
        <div className="quick-stat-item">
          <span className="number">&#8373;{overallSales}</span>
          <span className="desc">Overall sales</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStat;

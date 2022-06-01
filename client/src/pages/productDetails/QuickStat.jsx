import moment from 'moment'
const QuickStat = ({ dailySales, monthlySales, annualSales, overallSales }) => {
  return (
    <div className="quick-stat">
      <h1 className="heading">Drug Sales Performance</h1>
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

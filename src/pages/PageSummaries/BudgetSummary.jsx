import { Link } from "react-router";
import rightArrow from "../../assets/images/icon-caret-right.svg";
import commonStyles from "../../styles/commonsummary.module.css";
import styles from "../../styles/budget.module.css";
import BudgetChart from "../../components/BudgetChart";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useBudgetConfig } from "../../context/BudgetConfigContext";
import { useBudget } from "../../context/budgetContext";


const BudgetSummary = ({showViewAll, showDetails}) => {
  const authContext = useContext(AuthContext);
  const { startData } = authContext;
  const { currentConfig } = useBudgetConfig() 
  const { categoryTotals, groupedTransactions, transactions, budgets} = useBudget()

  console.log(budgets)

  const recentBudgets = budgets.slice(-4).map((item, index) => {
    const spent = categoryTotals[item.category] || 0;

    return(
    <div className={styles.budget__item} key={index}>
      <div
        style={{
          height: "2.5rem",
          width: ".25rem",
          backgroundColor: `${item.theme}`,
          borderRadius: ".5rem",
        }}
      ></div>
      <div>
        <p className={styles.category}>{item.category}</p>
        <p className={styles.maximum}> ${spent.toFixed(2)} of ${item.maximum}.00</p>
      </div>
    </div>
    )
});

  return (
    <div className={styles.area}>
      <div className={`${commonStyles.summary} ${styles.summary}`}>
        <header className={`${commonStyles.header} ${styles.header}`}>
          <h2>Budgets</h2>
          {showViewAll && <Link
            className={commonStyles.link}
            to={{
              pathname: "budgets",
            }}
          >
            <p>View All</p>
            <img src={rightArrow} alt="navigation to page" />
          </Link>}
        </header>
        <div className={styles.budget_info_container}>
          <BudgetChart showDetails={showDetails || currentConfig.showChartDeat } showViewAll={showViewAll} budget={budgets}/>
          <div className={styles.budgets}>{recentBudgets}</div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;

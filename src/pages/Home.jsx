import { useContext, useEffect, useMemo } from "react";
import BudgetSummary from "./PageSummaries/BudgetSummary";
import PotsSummary from "./PageSummaries/PotsSummary";
import TransactionsSummary from "./PageSummaries/TransactionSummary";
import { AuthContext } from "../context/authContext";
import overviewStyles from "../styles/overview.module.css"
import RecurringSummary from "./PageSummaries/RecurringSummary";
import { useBudgetConfig } from "../context/BudgetConfigContext";
import { useTransaction } from "../context/transactionContext";
import commonStyles from "../styles/common.module.css"

const Home = () => {
  const authContext = useContext(AuthContext);
  const { startData, user } = authContext;
  const { setBudgetConfig } = useBudgetConfig();
  const { transactions, fetchTransactions } = useTransaction();

  useEffect(() => {
    setBudgetConfig("dashboardPage")
  }, [setBudgetConfig]);

  // Fetch transactions when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      fetchTransactions(user.id);
    }
  }, [user?.id]); // Removed fetchTransactions from dependencies

  // Calculate income and expenses from transactions
  const { totalIncome, totalExpenses, currentBalance } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalIncome: 0, totalExpenses: 0, currentBalance: 0 };
    }

    let income = 0;
    let expenses = 0;

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0;
      if (amount > 0) {
        income += amount;
      } else {
        expenses += Math.abs(amount);
      }
    })

    let current = income - expenses

    return { totalIncome: income, totalExpenses: expenses, currentBalance: current };
  }, [transactions]);

  const AccountBalance = () => {
    // Get the current balance (assuming first entry is the main balance)

    return (
      <div className={`${overviewStyles.account__summary} ${overviewStyles.area}`}>
        {startData ? (
          <>
            {/* Current Balance */}
            <div className={`${overviewStyles.account__info} ${overviewStyles.highlight}`}>
              <p className={overviewStyles.account__name}>Current</p>
              <p className={overviewStyles.account__balance}>{currentBalance.toFixed(2)}</p>
            </div>

            {/* Income */}
            <div className={overviewStyles.account__info}>
              <p className={overviewStyles.account__name}>Income</p>
              <p className={overviewStyles.account__balance}>{totalIncome.toFixed(2)}</p>
            </div>

            {/* Expenses */}
            <div className={overviewStyles.account__info}>
              <p className={overviewStyles.account__name}>Expenses</p>
              <p className={overviewStyles.account__balance}>{totalExpenses.toFixed(2)}</p>
            </div>
          </>
        ) : (
          <p>Loading balance data...</p>
        )}
      </div>
    );
  };
  
  return (
    <div className={overviewStyles.container}>
      <h1>Overview</h1>
      <div className={overviewStyles.content__container}>
        <AccountBalance />
        <PotsSummary />
        <BudgetSummary />
        <TransactionsSummary />
        <RecurringSummary />
      </div>
    </div>
  );
};

export default Home;

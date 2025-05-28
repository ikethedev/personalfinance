import React, { useContext, useEffect } from "react";
import { useBudget } from "../context/BudgetContext";
import { useAuth } from "../context/authContext"

import budgetProgressStyles from "../styles/budgetprogress.module.css"

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "../styles/budget.module.css";
import "../styles/root.css";
import { AuthContext } from "../context/authContext";

const BudgetChart = ({
  showDetails,
  showDetailsButton,
}) => {
  const { startData, user } = useAuth();
  const { categoryTotals, groupedTransactions, transactions, budgets, fetchBudgets} = useBudget()
  const budgetTotal = budgets.reduce((acc, cur) => acc + cur.maximum, 0)

  console.log(budgets)
  

  // Debug useEffect to track budgets changes
  useEffect(() => {
    console.log('Budgets updated in BudgetChart:', budgets);
  }, [budgets]);

  const data = budgets.map((item) => item);

  const chartData = budgets.map((budget) => {
    const spent = categoryTotals[budget.category] || 0
    return {
       ...budget, 
       spent: spent, 
       remaining: budget.maximum - spent // Fixed: was budget.max, should be budget.maximum
    }
  })

  const totalLimit = budgets.reduce((acc, cur) => acc + cur.maximum, 0)
  console.log(totalLimit)
  const totalSpent = budgets.reduce((acc, cur) => acc + cur.spent, 0)
  console.log(totalSpent)

  console.log('Chart data:', chartData)

  const recentBudgets = budgets.slice(-4).map((item, index) =>  (
    <div className={styles.budget__item} key={index}>
      <div
        style={{
          height: "100%",
          width: ".25rem",
          backgroundColor: `${item.theme}`,
          borderRadius: ".5rem",
        }}
      ></div>
      <div>
        <p className={styles.category}>{item.category}</p>
        <p className={styles.maximum}>${item.maximum}.00</p>
      </div>
    </div>
  ));

  
  // Add loading/empty state handling
  if (!user?.id) {
    return <div>Please log in to view budgets</div>;
  }

  if (!budgets || budgets.length === 0) {
    return <div>No budgets found. Loading...</div>;
  }

  return (
    <div
      className={styles.chart__wrapper}
      style={{ borderRadius: "1rem", padding: "1rem", position: "relative" }}
    >
      <ResponsiveContainer width={300} height={300}  style={{ position: "relative" }}>
        <PieChart>
          <defs>
            {data.map((entry, index) => (
              <linearGradient
                id={`gradient-${index}`}
                key={index}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={entry.theme} stopOpacity={1} />
                <stop offset="100%" stopColor={entry.theme} stopOpacity={0.5} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={100}
            dataKey="maximum"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <div className={styles.budget__limit}> 
          <p className={styles.total__spent}>${totalSpent || 0}</p>
          <p className={styles.limit}> of ${totalLimit} limit</p>
        </div>
      </ResponsiveContainer>

      {/* Conditionally render "Spending Summary" */}
      <Legend />
     
    </div>
  );
};

export default BudgetChart;
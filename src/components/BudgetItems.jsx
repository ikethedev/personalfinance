import { useState } from "react";
import { NavLink } from "react-router";
import commonStyles from "../styles/common.module.css";
import cardStyles from "../styles/card.module.css";
import styles from "../styles/budgetItem.module.css"; // Combined stylesheet
import rightArrow from "../assets/images/icon-caret-right.svg";
import BudgetProgress from "./BudgetProgress";
import { formatDate } from "../utils/General";
import ellipsis from "../assets/images/icon-ellipsis.svg";
import { useBudget } from "../context/BudgetContext";
import useModalManagement from "./useModalManagement/"
import PostActionsModal from "./PostActionsModal"
import pageStyles from "../styles/potsItem.module.css";




export default function BudgetItems({budget, category, spent, max, theme, handleOpenEdit, handleDelete}) {
  
    const { budgets, transactions, groupedTransactions, categoryTotals } = useBudget();
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [actionType, setActionType] = useState("");
    console.log(category)


    const handleEditClick = () => {
      setShowMenu(false);
      setActionType("edit")
      handleOpenEdit(category)
    };
  
    const handleDeleteClick = () => {
      setShowMenu(false);
      handleDelete();
    };


    const renderCategoryTransactions = (category) => {
      const categoryTransactions = transactions
        .filter(transaction => transaction.category === category)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
  
      if (categoryTransactions.length === 0) {
        return null;
      }
  
      return (
        <div className={styles.transaction}>
          <div className={styles.transaction_header}>
            <div className={styles.transaction_header}>
              <h3 className={styles.latest_spending}>Latest Spending</h3>
            </div>
            <div className={styles.transaction_link}>
              <NavLink to="/transactions" className={styles.transaction_link_item} end> See All </NavLink>
              <img src={rightArrow} alt="See all" />
            </div>
          </div>
  
          <div>
            {categoryTransactions.map((transaction, index) => (
              <div key={transaction.id || index} className={styles.list_item}>
                <p className={commonStyles.transaction_sender}>{transaction.name}</p>
                <div className={styles.list_data}>
                  <p className={commonStyles.transaction_amount}>
                    -${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className={commonStyles.transaction_date}>
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };
  
    const renderBudgetCard = (budget) => {
      const groupData = groupedTransactions.find(group => group.category === budget.category);
      if (!budget) return null;


    const handleClick = () => {
      setActiveMenuId(activeMenuId === budget.id ? null : budget.id)
    }
  
      
    };
  
    return (
      <div key={budget.id || budget.category} className={`${cardStyles.card} ${styles.budget_card}`}>
        <div>
          <div className={cardStyles.card_header}>
            <div className={cardStyles.title}>
              <div className={cardStyles.colored_dot} style={{ backgroundColor: theme }}> </div>
              <h2 className={cardStyles.budget_card}>{category}</h2>
            </div>
            <div className={styles.menu}>
              <img
                onClick={() => setShowMenu(!showMenu)}
                src={ellipsis}
                alt="toggle menu"
              />
            </div>
            {showMenu && (
                <ul className={pageStyles.menu_options}>
                  <li
                    onClick={handleEditClick}
                    className={pageStyles.list_item}
                  >
                    Edit Budget
                  </li>
                  <li
                    onClick={handleDeleteClick}
                    className={pageStyles.delete_btn}
                  >
                    Delete Budget
                  </li>
                </ul>
              )}
          </div>
          <BudgetProgress 
            spent={spent}
            category={category} 
            max={max} 
            theme={theme} 
          />
        </div>
        {renderCategoryTransactions(category)}
        
      </div>
    );
  }
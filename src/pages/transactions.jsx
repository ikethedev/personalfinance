import React, { useContext, useEffect, useState, useMemo } from "react";
import TransactionsSummary from "./PageSummaries/TransactionSummary";
import commonStyles from "../styles/common.module.css"
import { AuthContext } from "../context/authContext";
import styles from "../styles/transactionssummary.module.css";
import pageStyles from "../styles/transaction.module.css";
import Pagination from "../components/Pagination";
import searchIcon from "../assets/images/icons/searchIcon.svg";
import sortIcon from "../assets/images/icons/sortIcon.svg";
import categoryIcon from "../assets/images/icons/categoryIcon.svg";
import downarrow from "../assets/images/icons/downarrow.svg";
import { formatDate } from "../utils/General"
import useModalManagement from '../components/useModalManagement';
import { useTransaction } from '../context/transactionContext'
import { createTransactionModalConfig } from '../utils/modalConfigUtils'
import TransactionModal from '../components/TransactionModal'
import { useAuth } from "../context/authContext"

const Transactions = () => {
  const { startData, user } = useAuth();
  const { transactions, deleteTransaction, addTransaction, editTransaction, fetchCategories, fetchTransactions } = useTransaction()
  const { isModalOpen , actionType, selectedItemId, openModal, closeModal } = useModalManagement();
  
  useEffect(() => {
    if(user?.id) {
      fetchTransactions(user?.id)
    }
  }, [user?.id])
  
  const getAvatarColor = (name) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];
    
    // Use the first character's char code to determine color
    const charCode = name.charAt(0).toUpperCase().charCodeAt(0);
    const colorIndex = charCode % colors.length;
    return colors[colorIndex];
  };

  // Letter Avatar Component
  const LetterAvatar = ({ name }) => {
    const firstLetter = name.charAt(0).toUpperCase();
    const backgroundColor = getAvatarColor(name);
    
    const avatarStyle = {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: backgroundColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px',
      flexShrink: 0
    };

    return (
      <div className={styles.default_avatar} style={avatarStyle}>
        {firstLetter}
      </div>
    );
  };
  
  const sortTransactions = (transactions, options) => {
    const transactionCopy = [...transactions];
    switch (options.toLowerCase()) {
      case "latest":
        return transactionCopy.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      case "oldest":
        return transactionCopy.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      case "spending":
        return transactionCopy.sort((a, b) => a.amount - b.amount);
      case "deposit":
        return transactionCopy.sort((a, b) => b.amount - a.amount);
      default:
        return transactionCopy;
    }
  };

  const selectedTransaction = useMemo(() => {
   
  }, [selectedItemId, transactions]);

  const handleAddTransaction = () => {
    openModal("add transaction", null)
  }

  const handleEditTransaction = () => {
    openModal("edit transaction", null)
  }

  const handleDeleteTransaction = () => {
    openModal("delete transaction", null)
  }

  const modalConfig = useMemo (() => {
    return createTransactionModalConfig({
      selectedTransaction,
      handleAddTransaction,
      handleEditTransaction,
      handleDeleteTransaction,
      closeModal
    })
  }, [selectedTransaction, closeModal]);

  const RenderTransactions = () => {
    return (
      <ul className={styles.list}>
        {transactions.map((item, index) => (
          <li key={item.id || index} className={styles.list__item}>
            <div className={styles.list__from}>
              <div className={styles.profile_info}>
                <LetterAvatar name={item.name} />
                <p className={styles.sender}>{item.name}</p>
              </div>
              <p className={styles.category}>{item.category}</p>
            </div>
            <div className={styles.list__receipt}>
              <p
                className={`${item.amount > 0 ? `${styles.deposit}` : ""} ${
                  styles.transaction
                }`}
              >
                {item.amount > 0
                  ? `+$${item.amount.toFixed(2)}`
                  : `-$${Math.abs(item.amount).toFixed(2)}`}
              </p>
              <p className={styles.date}>{formatDate(item.date)}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderCurrentModal = () => {
    if (!isModalOpen) {
      return null;
    }
    console.log(isModalOpen)
    const { component } = modalConfig[actionType];
    return component ? component() : null;
  };

  const currentModal = modalConfig[actionType];
 
  return (
    <div className={pageStyles.main_container}>
      <div className={pageStyles.title_container}>
        <h1 className={pageStyles.title}>Transaction</h1>
        <button onClick={handleAddTransaction} className={commonStyles.header_btn}>+ Add New Transaction</button>
      </div>
      {isModalOpen && renderCurrentModal()}
      <RenderTransactions />
    </div>
  );
};

export default Transactions;
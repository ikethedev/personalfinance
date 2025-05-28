import React, { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../context/authContext";
import { useBills } from "../context/billsContext"
import commonStyles from "../styles/common.module.css"
import pageStyles from "../styles/recurring.module.css";
import downarrow from "../assets/images/icons/downarrow.svg";
import BillSummary from "../components/BillSummary";
import BillItems from "../components/BillItems";
import { supabase } from '../backend/supabaseClient';
import { getStatusIcon, capitalizeFirstLetter, getTotalMonthlyBills } from "../utils/BillsUtils";
import { useTransaction } from '../context/transactionContext'
import { useAuth } from "../context/authContext"
import TransactionModal from "../components/TransactionModal"
import useModalManagement from '../components/useModalManagement';
import { createTransactionModalConfig } from '../utils/modalConfigUtils'


const RecurringBills = () => {
  const { startData, user } = useAuth();
  const { transactions, fetchTransactions } = useTransaction()
  const { sortOption, setSortOption, showSort, setShowSort } = useBills()
  const { isModalOpen , actionType, selectedItemId, openModal, closeModal } = useModalManagement();

  useEffect(() => {
    if(user?.id) {
      fetchTransactions(user?.id)
    }
  }, [user?.id])

  const recurringBills = transactions
  .filter((item) => item.recurring)
  .filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (existingTransaction) => existingTransaction.name === item.name
      )
  );

const totalRecurring = recurringBills.reduce((acc, cur) => acc + cur.amount, 0);

const getCurrentDate = new Date();
const currentMonth = getCurrentDate.getMonth();
const currentYear = getCurrentDate.getFullYear();

const currentMonthBills = transactions.filter((item) => {
  const txDate = new Date(item.date);
  return (
    item.category === "Bills" &&
    txDate.getMonth() === currentMonth &&
    txDate.getFullYear() == currentYear
  );
});

const totalBillsPaid = currentMonthBills.reduce(
  (acc, cur) => acc + Math.abs(cur.amount),
  0
);


const sortByDate = [...recurringBills].sort(
  (a, b) => a.recurring_day - b.recurring_day
);

const handleAddTransaction = () => {
  openModal("add transaction", null)
}

const handleEditTransaction = () => {
  openModal("edit transaction", null)
}

const handleDeleteTransaction = () => {
  openModal("delete transaction", null)
}

const billBreakDown = getTotalMonthlyBills(transactions);
  const handleAddClick = () => {
    alert("Hello World")
  }

  const selectedTransaction = useMemo(() => {
   
  }, [selectedItemId, transactions]);
  
  const modalConfig = useMemo (() => {
    return createTransactionModalConfig({
      selectedTransaction,
      handleAddTransaction,
      handleEditTransaction,
      handleDeleteTransaction,
      closeModal
    })
  }, [selectedTransaction, closeModal]); 

  const renderCurrentModal = () => {
    if (!isModalOpen) {
      return null;
    }
    const { component } = modalConfig[actionType];
    return component ? component() : null;
  };

  const currentModal = modalConfig[actionType];


  return (
    <div className={commonStyles.container}>
     <header className={commonStyles.header}>
            <h1>Recurring</h1>
            <button onClick={handleAddTransaction} className={commonStyles.header_btn}>+ Add New Recurring</button>
        </header>
        <ul>
        <main className={pageStyles.content_container}>
        <BillSummary billBreakDown={billBreakDown}/>
        <BillItems sortOption={sortOption} sortByDate={sortByDate} />  
      </main>
        </ul>
        {isModalOpen && renderCurrentModal()}
    </div>
  );
};

export default RecurringBills;

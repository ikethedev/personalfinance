import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { useAuth } from "./authContext"
import { supabase } from '../backend/supabaseClient';

export const TransactionsContext = createContext(null);

export const TransactionsProvider = ({ children }) => {
    const { startData, setStartData, user  } = useAuth();
    const [transactions, setTransactions] = useState([]);

    const deleteTransaction = useCallback((transactionId) => {
        alert("Deleting Transaction ")
    }, []);

    const fetchTransactions = useCallback(async (userId) => {
        if(!userId) return ;
  
        try {
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
  
            setTransactions(data || [])
            console.log("Transactions fetched:", data)
        } catch (err) {
          console.error("Error fetching transactions:", err)
        }
    }, []);

    const addTransaction = useCallback((e, newTransaction) => {
        e.preventDefault()
        console.log(newTransaction)
        alert("creating transactions")
    }, []);

    const editTransaction = useCallback((transactionId, updatedTransaction) => {
        alert("Transaction updated")
    }, []);

    const fetchCategories = useCallback(async () => {
        const { data, error} = await supabase
            .from('categories')
            .select('*')

        console.log(data)
        return data
    }, []);

    const value = useMemo(() => ({
        transactions,
        deleteTransaction,
        addTransaction,
        editTransaction,
        fetchCategories, 
        fetchTransactions
    }), [transactions, deleteTransaction, addTransaction, editTransaction, fetchCategories, fetchTransactions]);

    return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}

export const useTransaction = () => {
    const context = useContext(TransactionsContext); 

    if(!context) {
        throw new Error("useTransaction must be use withing a Transaction Provider")
    }

    return context
}
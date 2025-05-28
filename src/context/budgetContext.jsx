// Fixed budgetContext.jsx - Key issues resolved

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { useAuth } from "./authContext"
import { supabase } from '../backend/supabaseClient';

export const BudgetContext = createContext(null)

export const BudgetProvider = ({ children }) => {
  const { startData, setStartData, user  } = useAuth();
  const [budgets, setBudgets] = useState([])
  const transactions = startData?.transactions || [];
    
  // Wrap fetchBudgets in useCallback to prevent unnecessary re-renders
  const fetchBudgets = useCallback(async (userId) => {
    if(!userId) return;

    try {
      console.log('Fetching budgets for user:', userId);
      
      // Join with categories to get category name along with budget data
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          categories!inner(name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching budgets:', error);
        setBudgets([]);
        return;
      }

      // Transform the data to include category name at the top level
      const transformedData = data?.map(budget => ({
        ...budget,
        category: budget.categories?.name || 'Unknown Category'
      })) || [];

      console.log('Fetched budgets:', transformedData);
      setBudgets(transformedData);
    } catch (err) {
      console.error('Exception in fetchBudgets:', err);
      setBudgets([]);
    }
  }, []); // Empty dependency array since it doesn't depend on any values

  // Auto-fetch budgets when user changes
  useEffect(() => {
    if (user?.id) {
      fetchBudgets(user.id);
    } else {
      // Clear budgets when user logs out
      setBudgets([]);
    }
  }, [user?.id, fetchBudgets]);
 
  const addBudget = useCallback(async (newBudget) => {
    if (!user) {
      console.error("No user found");
      return null;
    }

    if (!newBudget || !newBudget.category) {
      console.error("Invalid budget data");
      return null;
    }
    
    try {
      // First, find or create the category
      let categoryId;
      const categoryName = newBudget.category;
      
      console.log("Looking for category:", categoryName);
      
      // Try to find the category by name
      const { data: existingCategory, error: findError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .maybeSingle();
      
      if (findError) {
        console.error("Error finding category:", findError);
      }
      
      if (existingCategory) {
        // Category exists, use its ID
        categoryId = existingCategory.id;
        console.log("Found existing category with ID:", categoryId);
      } else {
        // Category doesn't exist, create it
        console.log("Creating new category:", categoryName);
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert([{ name: categoryName }])
          .select('id')
          .single();
        
        if (categoryError) {
          console.error("Error creating category:", categoryError);
          return null;
        }
        
        categoryId = newCategory.id;
        console.log("Created new category with ID:", categoryId);
      }
      
      const budgetData = {
        user_id: user.id,
        category_id: categoryId,
        maximum: newBudget.maximum,
        theme: newBudget.theme || 'Green',
        spent: 0 // Initialize spent to 0
      };
      
      console.log("Inserting budget:", budgetData);
      
      const { data, error } = await supabase
        .from('budgets')
        .insert([budgetData])
        .select(`
          *,
          categories!inner(name)
        `)
        .single();
      
      if (error) {
        console.error("Error adding budget:", error);
        return null;
      }
      
      // Transform the returned data to include category name
      const transformedBudget = {
        ...data,
        category: data.categories?.name || categoryName
      };
      
      // Update state with the new budget
      setBudgets(prevBudgets => [...prevBudgets, transformedBudget]);
      console.log("Successfully added budget:", transformedBudget);
      return transformedBudget;
      
    } catch (error) {
      console.error("Exception in addBudget:", error);
      return null;
    }
  }, [user]);

  const editBudget = useCallback(async (budgetId, updatedBudget) => {
    if (!user || !budgetId) {
      console.error("Missing user or budget ID");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('budgets')
        .update({
          maximum: updatedBudget.maximum,
          theme: updatedBudget.theme
        })
        .eq('id', budgetId)
        .eq('user_id', user.id)
        .select(`
          *,
          categories!inner(name)
        `)
        .single();

      if (error) {
        console.error("Error updating budget:", error);
        return null;
      }

      // Transform the returned data
      const transformedBudget = {
        ...data,
        category: data.categories?.name || 'Unknown Category'
      };

      // Update local state
      setBudgets(prevBudgets => 
        prevBudgets.map(budget => 
          budget.id === budgetId ? transformedBudget : budget
        )
      );

      return transformedBudget;
    } catch (error) {
      console.error("Exception in editBudget:", error);
      return null;
    }
  }, [user]);

  const deleteBudget = useCallback(async (budgetId) => {
    if (!user || !budgetId) {
      console.error("Missing user or budget ID");
      return;
    }

    try {
      console.log("Deleting budget with ID:", budgetId);

      // Delete the budget (don't delete the category as it might be used elsewhere)
      const { error: budgetError } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId)
        .eq('user_id', user.id); // Ensure user can only delete their own budgets

      if (budgetError) {
        console.error('Error deleting budget:', budgetError);
        return;
      }

      // Update UI state
      setBudgets(prevBudgets => prevBudgets.filter(b => b.id !== budgetId));
      console.log("Successfully deleted budget");
      
    } catch (error) {
      console.error("Exception in deleteBudget:", error);
    }
  }, [user]);

  const groupTransactionsByCategory = useCallback((transactions, groupField = 'category', valueField = null) => {
    const grouped = {};

    transactions.forEach(transaction => {
      const groupValue = transaction[groupField] || "Uncategorized";

      if(!grouped[groupValue]){
        grouped[groupValue] = {
          [groupField]: groupValue, 
          transactions: [],
          total: 0
        };
      } 

      grouped[groupValue].transactions.push(transaction)

      if(valueField && transaction[valueField] !== undefined) {
        const amount = parseFloat(transaction[valueField]) || 0
        grouped[groupValue].total += Math.abs(amount);
      }
    });

    return Object.values(grouped)
  }, []);

  const groupedTransactions = useMemo(() => {
    return groupTransactionsByCategory(transactions, 'category', 'amount')
  }, [transactions, groupTransactionsByCategory])
  
  const { totalSpent, totalBudget } = useMemo(() => {
    return groupedTransactions.reduce((acc, group) => {
      const matchingBudget = budgets.find(b => b.category === group.category);
      if (!matchingBudget) return acc;

      acc.totalSpent += group.total;
      acc.totalBudget += matchingBudget.maximum;
      return acc;
    }, { totalSpent: 0, totalBudget: 0 });
  }, [groupedTransactions, budgets]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    groupedTransactions.forEach(group => {
      totals[group.category] = group.total;
    });
    return totals
  }, [groupedTransactions])

  const value = {
    budgets,
    transactions,
    groupedTransactions,
    totalSpent,
    totalBudget,
    categoryTotals,
    addBudget, 
    editBudget,
    deleteBudget,
    fetchBudgets,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if(!context) {
        throw new Error("useBudget must be used within a BudgetProvider");
    }

    return context;
}
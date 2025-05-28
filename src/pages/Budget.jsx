// Fixed Budget.jsx component
import React, { useState, useContext, useMemo, useEffect} from "react";
import commonStyles from "../styles/common.module.css"
import { useAuth } from "../context/authContext"
import { useBudget } from "../context/budgetContext";
import useModalManagement from '../components/useModalManagement';
import FormModal from "../components/FormModal"
import BudgetItems from "../components/BudgetItems"
import BudgetSummary from "./PageSummaries/BudgetSummary"
import { useBudgetConfig } from "../context/BudgetConfigContext";
import EditBudgetModal from "../components/EditBudgetModal"
import { createBudgetModalConfig } from '../utils/modalConfigUtils'
import styles from "../styles/budget.module.css"

const Budgets = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const { startData, user } = useAuth();
  const { setBudgetConfig } = useBudgetConfig();
  const { isModalOpen , actionType, selectedItemId, openModal, closeModal } = useModalManagement();
  const { budgets, transactions, addBudget, editBudget, deleteBudget, fetchBudgets } = useBudget();

  useEffect(() => {
    if(user?.id) {
      fetchBudgets(user?.id)
    }
  }, [user?.id, fetchBudgets]) // Add fetchBudgets to dependencies

  useEffect(() => {
    const handleWindowFocus = () => {
      if (user?.id) {
        fetchBudgets(user.id);
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [user?.id, fetchBudgets]);

  useEffect(() => {
    setBudgetConfig("budgetPage")
  }, [setBudgetConfig]);

  const selectedBudget = useMemo(() => {
    const budget = selectedItemId ? budgets.find(budget => budget.id === selectedItemId) : null;
    return budget;
  }, [selectedItemId, budgets]);

  const handleRefresh = async () => {
    if (user?.id) {
      await fetchBudgets(user.id);
      setUpdateTrigger(prev => prev + 1);
    }
  };

  const handleOpenAdd = () => {
    openModal("add budget", null)
  }

  const handleAddBudget = async (newBudget) => {
    try {
      console.log("Adding budget:", newBudget);
      const result = await addBudget(newBudget);
      if (result) {
        console.log("Budget added successfully");
        closeModal();
        // Optionally refresh the list
        setUpdateTrigger(prev => prev + 1);
      } else {
        console.error("Failed to add budget");
        // Handle error - maybe show a toast or keep modal open
      }
    } catch (error) {
      console.error("Error in handleAddBudget:", error);
      // Handle error appropriately
    }
  }

  const handleOpenEdit = (budgetId) => {
    openModal('edit budget', budgetId)
  }

  const handleEditBudget = async (updatedBudget) => {
    try {
      if (!selectedItemId) {
        console.error("No budget selected for editing");
        return;
      }
      
      const result = await editBudget(selectedItemId, updatedBudget);
      if (result) {
        console.log("Budget updated successfully");
        closeModal();
        setUpdateTrigger(prev => prev + 1);
      } else {
        console.error("Failed to update budget");
      }
    } catch (error) {
      console.error("Error in handleEditBudget:", error);
    }
  }

  const handleDeleteBudget = async (budgetId) => {
    try {
      await deleteBudget(budgetId);
      closeModal();
      setUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error in handleDeleteBudget:", error);
    }
  }

  const modalConfig = useMemo (() => {
    return createBudgetModalConfig({
      selectedBudget,
      handleAddBudget,
      handleEditBudget, // Pass the correct handler
      handleDeleteBudget,
      closeModal
    });
  }, [selectedBudget, closeModal]);
    
  const renderCurrentModal = () => {
    if (!isModalOpen || !actionType || !modalConfig[actionType]) {
      return null;
    }
    const { component } = modalConfig[actionType];
    return component ? component() : null;
  };

  return( 
    <div className={commonStyles.container}>
      <header className={commonStyles.header}>
        <h1>Budgets</h1>
        <button onClick={handleOpenAdd} className={commonStyles.header_btn}>+ Add New Budget</button>
      </header>
      <div className={styles.container}>
        <BudgetSummary />
        <div className={`${commonStyles.flex} ${commonStyles.budget}`}>
          <div className={commonStyles.budget_container}>
            {budgets.map(budget => (
              <BudgetItems  
                key={`${budget.id}-${updateTrigger}`} 
                budget={budget} 
                category={budget.category} 
                spent={budget.spent}
                max={budget.maximum} 
                theme={budget.theme} 
                handleOpenEdit={() => handleOpenEdit(budget.id)} 
                handleDelete={() => handleDeleteBudget(budget.id)}
              />
            ))
            }
          </div>
        </div>
        {renderCurrentModal()}
      </div>
    </div>
  )
};

export default Budgets;
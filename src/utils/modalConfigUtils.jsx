import React, { lazy, Suspense } from 'react';

// Use React.lazy for component imports
const LazyFormModal = lazy(() => import('../components/FormModal'));
const LazyDeletePot = lazy(() => import('../components/DeletePot'));
const LazyTransaction = lazy(() => import('../components/TransactionModal'))

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    Loading...
  </div>
);

export const createPotModalConfig = ({
  selectedPot,
  handleAddPot,
  handleEditPot,
  handleDeletePot,
  closeModal
}) => ({
  "add pot": {
    component: () => (
      <Suspense fallback={<LoadingFallback />}>
        <LazyFormModal
          mode="add pot"
          title="Add Pot"
          formName="Add Pot"
          subText="Create a pot to set savings targets..."
          buttonText="Create Pot"
          placeholder="What are you saving for?"
          closeModal={closeModal}
          onSubmit={handleAddPot}
        />
      </Suspense>
    ),
    props: {}
  },
  "edit pot": {
    component: () => (
      <Suspense fallback={<LoadingFallback />}>
        <LazyFormModal
          mode="edit pot"
          title={selectedPot ? `Edit ${selectedPot.name}` : "Edit Pot"}
          formName="Edit Pot"
          subText="Update your savings goals..."
          buttonText="Save Changes"
          placeholder="What is your updated goal?"
          closeModal={closeModal}
          data={selectedPot}
          onSubmit={handleEditPot}
        />
      </Suspense>
    ),
    props: {}
  },
  "delete pot": {
    component: () => (
      <Suspense fallback={<LoadingFallback />}>
        <LazyDeletePot
          closeModal={closeModal}
          data={selectedPot}
          onSubmit={handleDeletePot}
        />
      </Suspense>
    ),
    props: {}
  }, 
 "add money": {
    mode: "add",
    title: `Add to '${name}'`,
    subHeader:
      "Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.",
    buttonText: "Confirm Add",
    closeModal: closeModal,
  },
 "withdraw money": {
    mode: "withdraw",
    title: `Withdraw from '${name}'`,
    subHeader:
      "Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.",
    buttonText: "Confirm Withdrawal",
    closeModal: closeModal,
  },
});

export const createBudgetModalConfig = ({
  selectedBudget,
  handleAddBudget,
  handleEditBudget,
  handleDeleteBudget,
  closeModal
}) => {
  return {
    "add budget": {
      component: () => (
        <Suspense fallback={<LoadingFallback />}>
          <LazyFormModal
            mode="add budget"
            title="Add Budget"
            formName="Add Budget"
            subText="Create a budget to track spending..."
            buttonText="Create Budget"
            placeholder="What are you tracking?"
            closeModal={closeModal}
            onSubmit={handleAddBudget}
          />
        </Suspense>
      ),
      props: {}
    },
    "edit budget": {
      component: () => (
        <Suspense fallback={<LoadingFallback />}>
          <LazyFormModal
            mode="edit budget"
            title={selectedBudget ? `Edit ${selectedBudget.category}` : "Edit Budget"}
            formName="Edit Pot"
            subText= "Update your budget details as needed."
            buttonText="Save Changes"
            placeholder="Update category name"
            closeModal={closeModal}
            data={selectedBudget}
            onSubmit={handleEditBudget}
          />
        </Suspense>
      ),
      props: {}  
    },
    "delete budget": {
      component: () => (
        <Suspense fallback={<LoadingFallback />}>
          <LazyDeletePot
            closeModal={closeModal}
            data={selectedBudget}
            onSubmit={handleDeleteBudget}
            mode={"delete budget"}
          />
        </Suspense>
      ),
      props: {}
    }, 
  };
};

export const createTransactionModalConfig = ({
  selectedTransaction,
  handleAddTransaction,
  handleEditTransaction,
  closeModal
}) => {
  return {
    "add transaction": {
      component: () => (
        <Suspense fallback={<LoadingFallback />}>
          <LazyTransaction
            mode="add transaction"
            title="Add Transaction"
            formName="Add Transaction"
            subText="Input your most recent transaction"
            buttonText="Create Transaction"
            placeholder="What was your transaction"
            closeModal={closeModal}
            onSubmit={handleAddTransaction}
          />
        </Suspense>
      ), 
      props: {}
    }, 
    "edit transaction": {
      component: () => (
        <Suspense fallback={<LoadingFallback />}>
          <LazyFormModal
            mode="edit transaction"
          />
        </Suspense>
      ), 
      props: {}
    }, 
    "delete transaction": {
      component: () => (
        <Suspense fallback={<LoadingFallback />}>
          <LazyFormModal
            mode="delete transaction"
          />
        </Suspense>
      ), 
      props: {}  
    }
   
  }
 
}
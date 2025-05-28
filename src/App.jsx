import React, { useContext } from "react";
import { AuthProvider } from "./context/authContext";
import { BudgetProvider } from "./context/budgetContext";
import { PotProvider } from "./context/potContext";
import { BillProvider } from "./context/billsContext"
import { AuthContext } from "./context/authContext";
import { TransactionsProvider } from "./context/transactionContext"
import AppRoutes from "./components/AppRoutes"


function App() {

  return (
    <AuthProvider>
      <TransactionsProvider>
        <BudgetProvider>
          <PotProvider>
            <BillProvider>
              <AppRoutes />
            </BillProvider>
          </PotProvider>
        </BudgetProvider>
      </TransactionsProvider>
    </AuthProvider>
  );
}

export default App;

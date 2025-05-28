import { useContext } from "react"
import { useAuth } from "../context/AuthContext"
import { BrowserRouter, Routes, Route } from "react-router"; 
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import NoPage from "../pages/NoPage";
import Budgets from "../pages/budget";
import Pots from "../pages/pots";
import Login from "../pages/Login";
import RecurringBills from "../pages/recurring";
import Transactions from "../pages/transactions";

import { BudgetConfigProvider } from "../context/BudgetConfigContext";

export default function AppRoutes() {
    const { isAuth } = useAuth();
    
    return isAuth ? (
      <BrowserRouter>
        <BudgetConfigProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="budgets" element={<Budgets />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="pots" element={<Pots />} />
                    <Route path="recurringbills" element={<RecurringBills />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BudgetConfigProvider>
      </BrowserRouter>
    ) : (
      <Login />
    );
  }

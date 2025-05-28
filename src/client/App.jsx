import { useState, useContext, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../pages/pages/Layout";
import Home from "../pages/pages/Home";
import NoPage from "../pages/pages/NoPage";
import Budgets from "../pages/pages/budget";
import Pots from "../pages/pages/pots";
import RecurringBills from "../pages/pages/recurring";
import Transactions from "../pages/pages/transactions";
import Login from "../pages/PageSummaries/Login";
import { AuthContext } from "./AuthContext";

import "./styles/root.css"


function App() {
  // user profile state 
  const [userProfile, setUserProfile] = useState(null);
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [startData, setStartData] = useState(null);

 

  const signOut = (e) => {
    e.preventDefault()
    setIsAuth(false)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, setIsAuth, signOut, startData, setStartData}}>
    {isAuth ?  <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="budgets" element={<Budgets />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="pots" element={<Pots />} />
                  <Route path="recurring" element={<RecurringBills />} />
                  <Route path="*" element={<NoPage />} />
              </Route>
          </Routes>
        </BrowserRouter> : <Login />}
    </AuthContext.Provider>
  )
}

export default App

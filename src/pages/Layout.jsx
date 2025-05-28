import { Outlet, Link, NavLink, useLocation } from "react-router";
import overviewIcon from "../assets/images/icon-nav-overview.svg";
import transactionIcon from "../assets/images/icon-nav-transactions.svg";
import recurringIcon from "../assets/images/icon-nav-recurring-bills.svg";
import potIcon from "../assets/images/icon-nav-pots.svg";
import budgetsIcon from "../assets/images/icon-nav-budgets.svg";
import logoLarge from "../assets/images/logo-large.svg"
import logoSmall from "../assets/images/logo-small.svg"
import hideMenu from "../assets/images/icon-minimize-menu.svg"
import navStyles from "../styles/navbar.module.css"
import "../styles/root.css";
import "../styles/font.css";
import React, { useState, useEffect } from "react";
import { useBudgetConfig } from "../context/BudgetConfigContext";

const Layout = () => {
    const [isExpanded, setIsExpanded] = useState(true)
    const { setBudgetConfig } = useBudgetConfig();
    const location = useLocation();   

    useEffect(() => {
      if(location.pathname === '/'){
        setBudgetConfig("dashboardPage")
      } else if (location.pathname === '/budgets'){
        setBudgetConfig("budgetPage");
      }
    }, [location.pathname, setBudgetConfig])

    useEffect(() => {
      const mediaQuery = window.matchMedia("(max-width: 64rem)");
  
      const handleChange = (e) => {
        setIsExpanded(!e.matches); // Collapse menu when screen is small
      };
  
      mediaQuery.addEventListener("change", handleChange);
  
      // Initial check to set state on first render
      setIsExpanded(!mediaQuery.matches);
  
      return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);
    const toggleMenu = () => {
        setIsExpanded(!isExpanded)
    }

    const handleNavItemClick = (page) => {
      if(page === "home"){
        setBudgetConfig("dashboardPage");
      } else if(page === "budgets"){
        setBudgetConfig("budgetPage");
      }
    }


    
  return (
    <>
      <nav className={`${isExpanded ? navStyles.expanded : navStyles.collapsed} ${navStyles.nav}`}>
        <picture className={navStyles.logoLarge}>
            <img src={isExpanded? logoLarge : logoSmall} alt="Finance logo" />
        </picture>
        <ul className={navStyles.navList}>
          <NavLink className={navStyles.nav_item} to="/" end onClick={() => handleNavItemClick("home")}>
            {({ isActive }) => (
              <li className={`${navStyles.nav__list_item} ${isActive ? navStyles.active : ""}`}>
                <img
                  src={overviewIcon}
                  alt="go to all overview"
                  className={`${navStyles.nav_icon} ${isActive ? navStyles.active_icon : ""}`}
                />
               <p className={`${navStyles.path__name} ${isExpanded ? navStyles.visible : navStyles.hidden}`}>Overview</p>
              </li>
            )}
          </NavLink>
          <NavLink className={navStyles.nav_item} to="/transactions" end>
            {({ isActive }) => (
              <li className={`${navStyles.nav__list_item} ${isActive ? navStyles.active : ""}`}>
                <img
                  src={transactionIcon}
                  alt="go to all overview"
                  className={`${navStyles.nav_icon} ${isActive ? navStyles.active_icon : ""}`}
                />
                <p className={`${navStyles.path__name} ${isExpanded ? navStyles.visible : navStyles.hidden}`}>Transactions</p> 
              </li>
            )}
          </NavLink>
          <NavLink className={navStyles.nav_item} to="/budgets" end onClick={() => handleNavItemClick("budgets")}>
            {({ isActive }) => (
              <li className={`${navStyles.nav__list_item} ${isActive ? navStyles.active : ""}`}>
                <img
                  src={budgetsIcon}
                  alt="go to all overview"
                  className={`${navStyles.nav_icon} ${isActive ? navStyles.active_icon : ""}`}
                />
                <p className={`${navStyles.path__name} ${isExpanded ? navStyles.visible : navStyles.hidden}`}>Budgets</p>
              </li>
            )}
          </NavLink>
          <NavLink className={navStyles.nav_item} to="/pots" end>
            {({ isActive }) => (
              <li className={`${navStyles.nav__list_item} ${isActive ? navStyles.active : ""}`}>
                <img
                  src={potIcon}
                  alt="go to all overview"
                  className={`${navStyles.nav_icon} ${isActive ? navStyles.active_icon : ""}`}
                />
                <p className={`${navStyles.path__name} ${isExpanded ? navStyles.visible : navStyles.hidden}`}>Pots</p>

              </li>
            )}
          </NavLink>
          <NavLink className={navStyles.nav_item} to="/recurringbills" end>
            {({ isActive }) => (
              <li className={`${navStyles.nav__list_item} ${isActive ? navStyles.active : ""}`}>
                <img
                  src={recurringIcon}
                  alt="go to all overview"
                  className={`${navStyles.nav_icon} ${isActive ? navStyles.active_icon : ""}`}
                />
                <p className={`${navStyles.path__name} ${isExpanded ? navStyles.visible : navStyles.hidden}`}>Recurring</p>
              </li>
            )}
          </NavLink>
        </ul>
        <div className={navStyles.toggle__container} onClick={toggleMenu}>
            <img src={hideMenu} alt="minimize menu" className={`${isExpanded? navStyles.rotate0 : navStyles.rotate180}`}/>
             <p className={`${navStyles.path__name} ${isExpanded ? navStyles.visible : navStyles.hidden}`}>Minimize Menu</p> 
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
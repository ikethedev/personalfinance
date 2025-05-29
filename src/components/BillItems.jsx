import { useContext, useMemo } from "react";
import pageStyles from "../styles/recurring.module.css";
import { getStatusIcon, capitalizeFirstLetter } from "../utils/BillsUtils";
import BillsSearchBar from "./BillsSearchBar";
import { AuthContext } from "../context/authContext";
import { useBills } from "../context/billsContext"


export default function BillItems({ sortByDate }) {
  const authContext = useContext(AuthContext);
  const { sortOption:selectedSortOption, sortOption, setSortOption, showSort, setShowSort } = useBills()


  const sortBills = useMemo(() => {
    const billsCopy = [...sortByDate];
    switch (selectedSortOption.toLowerCase()) {
      case "latest":
        return billsCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "oldest":
        return billsCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "highest":
        return billsCopy.sort((a, b) => a.amount - b.amount);
      case "lowest":
        return billsCopy.sort((a, b) => b.amount - a.amount);
      case "a to z":
        return billsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "z to a":
        return billsCopy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return billsCopy;
    }
  }, [sortByDate, selectedSortOption]);


  return (
    <div className={pageStyles.recurring_bills}>
      <BillsSearchBar sortByDate={sortByDate} />
      <div className={pageStyles.bill_category}>
        <p className={pageStyles.bill_category_title}>Bill Title</p>
        <div className={pageStyles.bill_category_data}>
          <p>Due Date</p>
          <p className={pageStyles.amount}>Amount</p>
        </div>
      </div>
      {sortBills.map((item, index) => [
        <div key={`item-${item.id || index}`} className={pageStyles.bill}>
          <div className={pageStyles.bill_header}>
            <img className={pageStyles.bill_icon} src={item.avatar} alt="" />
            <p className={pageStyles.bill_name}>{item.name}</p>
          </div>
          <div className={pageStyles.bill_frequency}>
            <div className={pageStyles.bill_status}>
              <p className={pageStyles.bill_due}>
                {capitalizeFirstLetter(item.frequency)} -{" "}
                {item.recurring_day}
              </p>
              {getStatusIcon(item)}
            </div>
            <p className={pageStyles.bill_amount}>
              ${Math.abs(item.amount).toFixed(2)}
            </p>
          </div>
        </div>,
        index < sortBills.length - 1 && (
          <div
            key={`divider-${item.id || index}`}
            className={pageStyles.bill_divider}
          ></div>
        ),
      ])}
    </div>
  );
}

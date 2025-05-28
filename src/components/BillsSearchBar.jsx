import { useContext } from "react";
import pageStyles from "../styles/recurring.module.css";
import downarrow from "../assets/images/icons/downarrow.svg";
import searchIcon from "../assets/images/icons/searchIcon.svg";
import sortIcon from "../assets/images/icons/sortIcon.svg";
import { useBills } from "../context/billsContext"


const BillsSearchBar = () => {
  const { sortOption:selectedSortOption, sortOption, setSortOption, showSort, setShowSort , showMenu} = useBills()
  console.log(sortOption)
  console.log(showSort)
  console.log(showMenu)

  return (
    <div className={pageStyles.search_container}>
      <div className={pageStyles.input_container}>
        <input
          className={pageStyles.input}
          type="text"
          placeholder="Search bills"
        />
        <img src={searchIcon} alt="" />
      </div>
      <div
        onClick={showMenu}
        className={`${pageStyles.filter_container} ${pageStyles.sortby}`}
      >
        <p className={pageStyles.category_label}>Sort By</p>
        <div className={pageStyles.input_container}>
          <p>{sortOption}</p>
          <img src={downarrow} alt="" />
        </div>
      </div>

      <img  onClick={showMenu} className={pageStyles.sortIcon} src={sortIcon} alt="" />
      {showSort && (
        <ul className={pageStyles.sort_menu}>
          <li
            onClick={() => {
              setSortOption("Latest");
              setShowSort(false);
            }}
          >
            Latest
          </li>
          <li
            onClick={() => {
              setSortOption("Oldest");
              setShowSort(false);
            }}
          >
            Oldest
          </li>
          <li
            onClick={() => {
              setSortOption("A to Z");
              setShowSort(false);
            }}
          >
            A to Z
          </li>
          <li
            onClick={() => {
              setSortOption("Z to A");
              setShowSort(false);
            }}
          >
            Z to A
          </li>
          <li
            onClick={() => {
              setSortOption("Highest");
              setShowSort(false);
            }}
          >
            Highest
          </li>
          <li
            onClick={() => {
              setSortOption("Lowest");
              setShowSort(false);
            }}
          >
            Lowest
          </li>
        </ul>
      )}
      </div> 
  );
};

export default BillsSearchBar;

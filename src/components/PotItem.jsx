import { useState } from "react";
import ellipsis from "../assets/images/icon-ellipsis.svg";
import cardStyles from "../styles/card.module.css"
import pageStyles from "../styles/potsItem.module.css";
import UpdatedSavings from "./UpdatedSavings";

export default function PotItems({
  id, 
  name, 
  target, 
  theme, 
  total, 
  handleOpenEdit, 
  handleDelete, 
  handleAddMoney, 
  handleWithdrawMoney 
}) {
  const [showMenu, setShowMenu] = useState(false);

  const handleEditClick = () => {
    setShowMenu(false);
    handleOpenEdit();
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    handleDelete();
  };

  const handleAddClick = () => {
    handleAddMoney();
  };

  const handleWithdrawClick = () => {
    handleWithdrawMoney();
  };

  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.card_header}>
        <div className={cardStyles.title}>
          <div className={cardStyles.colored_dot} style={{backgroundColor: theme}}></div>
          <h2>{name}</h2>
        </div>
        <div className={pageStyles.menu}>
          <img
            onClick={() => setShowMenu(!showMenu)}
            src={ellipsis}
            alt="toggle menu"
          />
          {showMenu && (
            <ul className={pageStyles.menu_options}>
              <li
                onClick={handleEditClick}
                className={pageStyles.list_item}
              >
                Edit Pot
              </li>
              <li
                onClick={handleDeleteClick}
                className={pageStyles.delete_btn}
              >
                Delete Pot
              </li>
            </ul>
          )}
        </div>
      </div>
      <UpdatedSavings 
        theme={theme}  
        savedAmount={total} 
        targetAmount={target} 
      />
      <div className={pageStyles.btn_container}>
        <button onClick={handleAddClick} className={pageStyles.btn}>
          + Add Money
        </button>
        <button onClick={handleWithdrawClick} className={pageStyles.btn}>
          Withdraw
        </button>
      </div>
    </div>
  );
}
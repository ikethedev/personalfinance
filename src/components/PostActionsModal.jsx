import useModalManagement from "./useModalManagement/"
import pageStyles from "../styles/potsItem.module.css";
import { useState } from "react"

export default function PostActionsModal({cardId}){
  console.log(cardId)
  const { isModalOpen, selectedItemId, openModal, closeModal } = useModalManagement();

  const [actionType, setActionType] = useState("");

  const handleOpenEdit = (potId) => {
    openModal('edit pot', potId)
  }

  const handleEditClick = () => {
    openModal("edit budget", null)
  };


  const handleDeletePot = (potId) => {
    openModal("delete budget", potId)
  }
 
  const handleDeleteClick = () => {
    alert("Hello")
  };

    return (
        <ul className={pageStyles.menu_options}>
                  <li
                    onClick={handleEditClick}
                    className={pageStyles.list_item}
                  >
                    Edit Budget
                  </li>
                  <li
                    onClick={handleDeleteClick}
                    className={pageStyles.delete_btn}
                  >
                    Delete Budget
                  </li>
                </ul>
    )
}
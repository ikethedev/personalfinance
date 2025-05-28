import {useContext} from "react"
import closeIcon from "../assets/images/icon-close-modal.svg";
import pageStyles from "../styles/commonmodal.module.css";
import {AuthContext} from "../context/authContext"
import { usePot } from "../context/potContext"
import { useBudget } from "../context/budgetContext";




export default function DeletePot({ id, closeModal, data, mode }) {
  const authContext = useContext(AuthContext)
  const {startData} = authContext
  const { deletePot, fetchPots, } = usePot()
  const { budgets, transactions, addBudget, editBudget, deleteBudget, fetchBudgets } = useBudget();
console.log(data)
  const handleDelete = async () => {
    if(mode === "delete budget"){
        await deleteBudget(data.id)
        closeModal()
    } else {
      if (data && data.id) {
        await deletePot(data.id)
        closeModal()
      } else {
        console.error("Cannot delete pot: No valid pot ID found", data)
      }
    }
  }


  return (
    <div className={pageStyles.modal_container}>
      <div className={pageStyles.overlay}></div>
      <div className={pageStyles.modal}>
        <header className={pageStyles.header}>
          {/* This header will be dynamic depending on the current pot card  */}
          <h1 className={pageStyles.title}>{`Delete ${data.name === undefined ? data.category : data.name}?`}</h1>
          <img
          onClick={closeModal}
            className={pageStyles.closeIcon}
            src={closeIcon}
            alt="Close Modal"
          />
        </header>
        <div>
          <p className={pageStyles.paragraph}>
            Are you sure you want to delete this budget? This action cannot be
            reversed, and all the data inside it will be removed forever.
          </p>
          <div className={pageStyles.btn_container}>
            <button onClick={handleDelete} className={pageStyles.btn_danger}>
              Yes, Confirm Deletion
            </button>
            <button onClick={closeModal} className={pageStyles.btn}>No, I want to go back</button>
          </div>
        </div>
      </div>
    </div>
  );
}

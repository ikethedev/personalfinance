import closeIcon from "../assets/images/icon-close-modal.svg";
import ModalForm from "./ModalForm"
import pageStyles from "../styles/commonmodal.module.css"

export default function EditBudgetModal(){
    return (
        <div className={pageStyles.modal_container}>
            <div className={pageStyles.header}>
                <h1>Edit Current Budget</h1>
                <img src={closeIcon} alt="close modal" />
            </div>
            <form className="edit">
                <ModalForm hideName={true}/>
            </form>
            <button className="submit_changes">
            </button>
        </div>
    )
}
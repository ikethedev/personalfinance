import pageStyles from "../styles/commonmodal.module.css";

const ModalTemplate = ({ title, buttonText, children, onSubmit}) => {
    const handleAction = (e) => {
        onSubmit();
    }

    return (
        <div className={pageStyles.modal_overlay}>
            <div className={pageStyles.modal_wrapper}>
                <h2>{title}</h2>
            <div className={pageStyles.model_body}>
                {children}
            </div>
            <button onClick={handleAction} className={pageStyles.save_btn}>
                {buttonText}
            </button>
            </div>
      </div>
    )
}

export default ModalTemplate
import pageStyles from "../styles/commonmodal.module.css";
import closeIcon from "../assets/images/icon-close-modal.svg";
import ModalForm from "./ModalForm";

export default function EditPot({ closeModal }) {
  
  return (
        <>
          <p className={pageStyles.paragraph}>
            If your saving targets change, feel free to update your pots.
          </p>          
          <ModalForm closeModal={closeModal} mode={'edit'}/>
      </>
  );
}

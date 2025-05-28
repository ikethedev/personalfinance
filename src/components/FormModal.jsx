import pageStyles from "../styles/commonmodal.module.css";
import closeIcon from "../assets/images/icon-close-modal.svg";
import ModalForm from "./ModalForm";
import { useState, useContext, useCallback } from "react"
import {AuthContext} from "../context/authContext"
import { v4 as uuidv4 } from 'uuid';
import useModalManagement from '../components/useModalManagement';
import { BudgetContext } from "../context/budgetContext"



export default function FormModal({mode, title, formName, subText, buttonText, placeholder, closeModal, data, onSubmit}) {
  const authContext = useContext(AuthContext)
  const [showType, setShowType] = useState(false)

  const [formData, setFormData] = useState( data || {
    name: '', 
    target: '',
    theme: 'Green', 
    total: 0
  })

  const handleClick = () => {
    closeModal()
  }

  const handleFormChange = useCallback((newFormData) => {
    setFormData(newFormData)
  }, []);

  const handleSubmit = () => {
    if(mode === "add budget") {
      const newPot = {
        id: uuidv4(),
        category: formData.name, 
        maximum: Number(formData.target), 
        theme: formData.theme, 
    
      }
      onSubmit(newPot)
      closeModal()
    } else if (mode === "add pot") {
      // Fixed: Use "target" property instead of "maximum" and use properly named variable
      const newPot = {
        id: uuidv4(),
        name: formData.name, 
        target: Number(formData.target), // Changed from maximum to target
        theme: formData.theme, 
        total: 0
      }
      onSubmit(newPot)
      closeModal()
    }
    else{
      const updatedPot = {
        ...data, 
        name: formData.name,
        target: parseFloat(formData.target) || data.target, 
        theme: formData.theme
      }
      onSubmit(updatedPot);
      closeModal()
      }
  }

  return (
    <div className={pageStyles.modal_container}>
      <div className={pageStyles.overlay}></div>
      <div className={pageStyles.modal}>
        <header className={pageStyles.header}>
          <h1 className={pageStyles.title}>{title}</h1>
          <img
            onClick={handleClick}
            className={pageStyles.closeIcon}
            src={closeIcon}
            alt="Close Modal"
          />
        </header>
        <div>
          <p className={pageStyles.paragraph}>
            {subText}
          </p>
        </div>
        <ModalForm formName={formName} placeholder={placeholder} initialData={data} onFormChange={handleFormChange}/>
        <button onClick={handleSubmit} className={pageStyles.save_btn}>{buttonText}</button>

      </div>
          </div>
  );
}
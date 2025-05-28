import UpdatedSavings from "./UpdatedSavings"
import pageStyles from "../styles/commonmodal.module.css";
import closeIcon from "../assets/images/icon-close-modal.svg";
import { useState } from "react";
import { supabase } from '../backend/supabaseClient';
import { useAuth } from "../context/authContext"
import { usePot } from "../context/potContext"
import useModalManagement from './useModalManagement';






export default function UpdateProgress({mode ,title, theme, subHeader, buttonText, closeModal, savedAmount, targetAmount , setTargetAmount, setSavedAmount, potId}){
    const [defaultAmount, setDefaultAmount] = useState(savedAmount)
    const [inputAmount, setInputAmount] = useState('');
    const [previewAmount, setPreviewAmount] = useState(savedAmount);
    const { startData, setStartData, user  } = useAuth();
    const { fetchPots } = usePot();
    const { isModalOpen, actionType, selectedItemId, openModal } = useModalManagement();

    const handleChange = (e) => {
       const value = e.target.value;
       setInputAmount(value)

       if(value && !isNaN(Number(value))){
        if(mode === "add"){
            setPreviewAmount(savedAmount + Number(value));
        } else if (mode === "withdraw"){
            setPreviewAmount(Math.max(0, savedAmount - Number(value)));
        }
       } else {
        setPreviewAmount(defaultAmount)
       }
    }

    const resetPreview = () => {
        setInputAmount('');
        setPreviewAmount(defaultAmount)
    }

    const updatePotAmount = async () => {
        setSavedAmount(previewAmount);

        if (!user) {
            return null;
        }
    
        try {
            const updatedPot = {
                total: previewAmount, 
                updated_at: new Date()
            };

            const { data, error } = await supabase
                .from('pots')
                .update(updatedPot)
                .eq('id', potId);

            if (error) {
                console.error("Error updating pot:", error);
                return null;
            }
            
            setSavedAmount(previewAmount)

            if (user.id) {
                fetchPots(user.id)
            }

            console.log("Pot updated successfully:", data);

            return data; // Return the updated data if needed
        } catch (err) {
            console.error("Unexpected error:", err);
            return null;
        }
    };
    


    const handleButtonSubmit = async (e) => {
        e.preventDefault()
        updatePotAmount()
        closeModal()
    }


        return(
        <div className={pageStyles.modal_container}>
        <div className={pageStyles.overlay}></div>
        <div className={pageStyles.modal}>
        <div >
            <div className={pageStyles.header}>
            <h2>{title}</h2>
            <img onClick={() => {
                closeModal();
                resetPreview();
                }
                } src={closeIcon} alt="close modal" />
            </div>
            <p>{subHeader}</p>
        </div>
        <div>
            <UpdatedSavings theme={theme} savedAmount={previewAmount} targetAmount={targetAmount} mode={mode} inputAmount={inputAmount} />
        </div>
        <form>
            <div >
                <label htmlFor={`Amount to ${mode}`}>Amount to {mode}</label>
                <div className={pageStyles.input_field}>
                    <span className={pageStyles.input_span}>$ <input type="text" placeholder="Enter a currency value" onChange={handleChange} /></span>
                </div>
            </div>
            <button className={pageStyles.save_btn} onClick={handleButtonSubmit}>{buttonText}</button>
        </form>
        </div>
    
        </div>
    )

}
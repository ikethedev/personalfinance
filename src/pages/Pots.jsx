import React, { useState, useContext, useMemo, useEffect} from "react";
import PotItems from "../components/PotItem";
import potStyles from "../styles/pots.module.css"
import commonStyles from "../styles/common.module.css"
import pageStyles from "../styles/recurring.module.css"
import FormModal from "../components/FormModal";
import EditPot from "../components/EditPot";
import DeletePot from "../components/DeletePot";
import UpdateProgress from "../components/UpdateProgress";
import { useAuth } from "../context/authContext"
import { usePot } from "../context/potContext"
import useModalManagement from '../components/useModalManagement';
import { createPotModalConfig } from '../utils/modalConfigUtils'
import ModalTemplate from '../components/ModalTemplate';

const Pots = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const { isModalOpen, actionType, selectedItemId, openModal, closeModal } = useModalManagement();
  const { pots, addPot, editPot, fetchPots } = usePot();
  const { user } = useAuth(); 

  const selectedPot = useMemo(() => {
    const pot = selectedItemId ? pots.find(pot => pot.id === selectedItemId) : null;
    return pot;
  }, [selectedItemId, pots]);
  
  useEffect(() => {
    if (user?.id) {
      fetchPots(user.id);
    }
  }, [user?.id]);

  const handleOpenAdd = () => {
    openModal("add pot", null)
  };

  const handleAddPot = (newPot) => {
    addPot(newPot);
    closeModal()
  }

  const handleEditPot = (updatedPot) => {
    editPot(selectedItemId, updatedPot);
    setUpdateTrigger(prev => prev + 1);
    closeModal()
  }

  const handleCloseModal = () => {
    closeModal()
  }
    
  const handleOpenEdit = (potId) => {
    openModal('edit pot', potId)
  }

  const handleDeletePot = (potId) => {
    openModal("delete pot", potId)
  }

  // Handle add/withdraw money modals
  const handleAddMoney = (potId) => {
    openModal("add money", potId)
  }

  const handleWithdrawMoney = (potId) => {
    openModal("withdraw money", potId)
  }

  const modalConfig = useMemo(() => {
    const baseConfig = createPotModalConfig({
      selectedPot,
      handleAddPot,
      handleEditPot,
      handleDeletePot,
      closeModal,
    });

    // Add configurations for add/withdraw money modals
    if (selectedPot) {
      baseConfig["add money"] = {
        component: () => (
          <UpdateProgress
            mode="add"
            title={`Add to '${selectedPot.name}'`}
            theme={selectedPot.theme}
            subHeader="Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance."
            buttonText="Confirm Add"
            closeModal={closeModal}
            targetAmount={selectedPot.target}
            savedAmount={selectedPot.total}
            potId={selectedPot.id}
          />
        )
      };

      baseConfig["withdraw money"] = {
        component: () => (
          <UpdateProgress
            mode="withdraw"
            title={`Withdraw from '${selectedPot.name}'`}
            theme={selectedPot.theme}
            subHeader="Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot."
            buttonText="Confirm Withdrawal"
            closeModal={closeModal}
            targetAmount={selectedPot.target}
            savedAmount={selectedPot.total}
            potId={selectedPot.id}
          />
        )
      };
    }

    return baseConfig;
  }, [selectedPot, closeModal]);

  const renderCurrentModal = () => {
    if (!isModalOpen || !actionType || !modalConfig[actionType]) {
      return null;
    }
  
    const { component } = modalConfig[actionType];
    return component ? component() : null;
  };

  return (
    <div className={commonStyles.container}>
       <header className={commonStyles.header}>
            <h1>Pots</h1>
            <button onClick={handleOpenAdd} className={commonStyles.header_btn}>+ Add New Pot</button>
        </header>
        <div className={potStyles.items}>
          {pots.map(pot => (
              <PotItems 
                key={`${pot.id}-${updateTrigger}`}
                id={pot.id}
                name={pot.name}  
                target={pot.target} 
                theme={pot.theme} 
                total={pot.total} 
                handleOpenEdit={() => handleOpenEdit(pot.id)} 
                handleDelete={() => handleDeletePot(pot.id)}
                handleAddMoney={() => handleAddMoney(pot.id)}
                handleWithdrawMoney={() => handleWithdrawMoney(pot.id)}
              />
          ))}
        </div>
        {renderCurrentModal()}
    </div>
  );
};
   
export default Pots;
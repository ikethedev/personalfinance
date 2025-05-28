import { useState } from 'react'

export default function useModalManagement(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [selectedItemId, setSelectedItemId] = useState(null);

    const openModal = (type, itemId = null) => {
        setActionType(type);
        setSelectedItemId(itemId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        
        setTimeout(() => {
            setActionType(null);
            setSelectedItemId(null);
        }, 100);

    };

    return{
        isModalOpen, 
        actionType,
        selectedItemId,
        openModal,
        closeModal
    };
}
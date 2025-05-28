import React, { createContext, useState, useContext, useMemo } from 'react'
import { useAuth } from "./authContext"


const BillsContext = createContext({})

export const BillProvider = ({ children })=> {
    
        const { startData, setStartData } = useAuth();
        const [showSort, setShowSort] = useState(false);
        const [sortOption, setSortOption] = useState("Latest");

        const showMenu = () => {
            setShowSort(!showSort);
            console.log('hello')
        }

        const value = {
            showMenu,
            showSort,
            setShowSort,
            sortOption,
            setSortOption
        }

        return (
            <BillsContext.Provider value={value}>
                {children}
            </BillsContext.Provider>
        );
}

export const useBills = () => {
    const context = useContext(BillsContext);

    if(!context) {
        throw new Error("useBills must be used within a BillsProvider")
    }
    
    return context
} 
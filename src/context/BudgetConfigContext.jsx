import React, { createContext, useContext, useState} from 'react';
import { budgetChartConfigs } from "../utils/BudgetUtils"

const BudgetConfigContext = createContext();

export function BudgetConfigProvider({ children }) {
    const [currentConfig, setCurrentConfig] = useState(budgetChartConfigs.dashboardPage)

    const setBudgetConfig = (configType) => {
        if(budgetChartConfigs[configType]){
            setCurrentConfig(budgetChartConfigs[configType])
        } else {
            console.error(`Budget config "${configType}" not found`)
        }
    }

    return (
        <BudgetConfigContext.Provider value={{currentConfig, setBudgetConfig}}>
            {children}
        </BudgetConfigContext.Provider>
    )
}

export function useBudgetConfig() {
    const context = useContext(BudgetConfigContext);
        if(context === undefined){
            throw new Error('useBudgetConfig must be used within a BudgetConfigProvider')
        }

        return context;
}
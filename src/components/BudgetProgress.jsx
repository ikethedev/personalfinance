import budgetProgressStyles from "../styles/budgetprogress.module.css"
import { useBudget } from "../context/budgetContext";

export default function BudgetProgress({ max, theme, categor, spent}){
    const { categoryTotals, groupedTransactions, group } = useBudget()
    
    const free = max - spent
   
    const spentPercentage = Math.min((spent / max) * 100, 100);
    
    const progressFillStyle = {
        backgroundColor: theme,
        width: `${spentPercentage}%`,
        height: '100%',
        borderRadius: '5px',
        transition: 'width 0.3s ease-in-out'
      };

    const sideBorderColor = {
        '--background-color': theme,
    };

    return (
       <div>
        <div className={budgetProgressStyles.budget_progress}>
            {/* the dollar amount is dynamic */}
            <p className={budgetProgressStyles.planned_total}>Maximum of ${max}</p>
            {/* Add progress bar styling here. DYNAMIC */}
            <div 
                className={budgetProgressStyles.budget_progress_bar}
                style={{
                    '--background-color': theme,
                    '--progress-percentage': `${spentPercentage}%`,
                }}
                ></div>           
                <div className={budgetProgressStyles.totals}>
                {/* Spent amount */}
                <div className={budgetProgressStyles.totals_spent}>
                    {/* sidebar for div  */}
                    <div className={budgetProgressStyles.totals_spents_border} style={sideBorderColor}></div>
                    <div>
                        <p>Spent</p>
                        <p>${spent.toFixed(2)}</p>
                    </div>
                </div>
                {/* Free  amount */}
                <div className={budgetProgressStyles.totals_free} style={sideBorderColor}>
                    {/* sidebar for div  */}
                    <div className={budgetProgressStyles.totals_free_border}></div>
                    <div>
                        <p>Free</p>
                        <p>${free.toFixed(2)}</p>
                    </div>
                </div>

            </div>
        </div>
       </div>
    )
}
import { useState } from "react";
import pageStyles from "../styles/potsItem.module.css";
import budgetProgressStyles from "../styles/budgetprogress.module.css"


export default function UpdatedSavings({theme, savedAmount, targetAmount, mode,  inputAmount }) {
  const currentPercentage = ((savedAmount/targetAmount) * 100).toFixed(2)
  const spent = 0
  const max = 0
  const free = max - spent
  let previewPercentage = currentPercentage;
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

  if(inputAmount && !isNaN(Number(inputAmount))) {
    if (mode === "withdraw") {
      previewPercentage = ((Math.max(0, savedAmount - Number(inputAmount)))/targetAmount * 100).toFixed(2);
    } else if (mode === "add") {
      previewPercentage = ((savedAmount + Number(inputAmount))/targetAmount * 100).toFixed(2);
    }
  }

  const progressBarStyle = {
    '--progress-width': `${Math.min(previewPercentage, 100)}%`,  // limit bar fill
    '--background-color': theme,
  };

  const displayPercentage = mode === "withdraw" ? previewPercentage : currentPercentage;

  return (
    <div className={pageStyles.progress_container}>
      <div className={pageStyles.progress_total}>
        <p className={pageStyles.paragraph}>Total Saved</p>
        {/*This code will be generated the selected pot*/}
        <p className={pageStyles.total_saved}>${savedAmount}</p>
      </div>
      <div className="progress_tracker">
        <div  className={`${pageStyles.progress_bar} ${mode === "withdraw" ? pageStyles.withdraw_mode : ""}` } 
        style={progressBarStyle}></div>
        <div className={pageStyles.progress_percentage}>
          {/* will be replaced by dynamic percent*/}
          <p className={pageStyles.percentage_amount}>  {displayPercentage > 100 ? 100 : displayPercentage}%</p>
          {/* will be replaced by dynamic target goal*/}
          <p className={pageStyles.paragraph}>Target of {targetAmount}</p>
        </div>
      </div>
    </div>
  );
}

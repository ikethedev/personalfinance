import pageStyles from "../styles/recurring.module.css";
import recurringIcon from "../assets/images/icon-recurring-bills.svg";

export default function BillSummary ({billBreakDown}){
  
    return(
        <div className={pageStyles.summary}>
        <div className={pageStyles.highlight}>
          <img src={recurringIcon} alt="" />
          <div>
            <p className={pageStyles.bill_total}>Total Bills</p>
            <p className={pageStyles.paid}>${billBreakDown.total.toFixed(2)}</p>
          </div>
        </div>
        <div className={pageStyles.summary_container}>
          <h2>Summary</h2>
          <div>
            <div className={pageStyles.account_summary}>
              <p className={pageStyles.bill_detail}>Paid Bills</p>
              <p className={pageStyles.amount_paid}>
                {billBreakDown.paidCount} ({billBreakDown.paid.toFixed(2)})
              </p>
            </div>
            <div className={pageStyles.divider}></div>
            <div className={pageStyles.account_summary}>
              <p className={pageStyles.bill_detail}>Total Upcoming</p>
              <p className={pageStyles.amount_paid}>
                {billBreakDown.expectedCount} (
                {billBreakDown.expected.toFixed(2)})
              </p>
            </div>
            <div className={pageStyles.divider}></div>
            <div
              className={`${pageStyles.account_summary} ${pageStyles.due_soon}`}
            >
              <p>Due Soon</p>
              <p
                className={`${pageStyles.due_soon_total} ${pageStyles.amount_paid}`}
              >
                {billBreakDown.billsDueSoonCount} (
                {billBreakDown.billsDueSoon.length === 0
                  ? "0.00"
                  : billBreakDown.billsDueSoon.toFixed(2)}
                )
              </p>
            </div>
          </div>
        </div>
        </div>
    )
} 
import { Link } from "react-router";
import rightArrow from "../../assets/images/icon-caret-right.svg";
import { useContext, useEffect } from "react";
import { useAuth } from "../../context/authContext"
import commonStyles from "../../styles/commonsummary.module.css";
import styles from "../../styles/recurringsummary.module.css";
import { formatDate } from "../../utils/General"
import { useTransaction } from '../../context/transactionContext'


const RecurringSummary = () => {
  const { startData, user } = useAuth();
  const { transactions, fetchTransactions } = useTransaction()

  useEffect(() => {
    if(user?.id) {
      fetchTransactions(user?.id)
    }
  }, [user?.id])


  const recurring = transactions.filter(
    (item) => item.recurring === true
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getCategorySums = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return recurring.reduce(
      (totals, item) => {
        const billDate = new Date(item.date);
        billDate.setHours(0, 0, 0, 0);

        const timeDifference = billDate - today;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

        if (daysDifference < 0) {
          totals.paidTotal += item.amount;
        } else if (daysDifference <= 7) {
          totals.dueSoonTotal += item.amount;
        } else {
          totals.upcomingTotal += item.amount;
        }
        return totals;
      },
      { paidTotal: 0, dueSoonTotal: 0, upcomingTotal: 0 }
    );
  };

  const { paidTotal, dueSoonTotal, upcomingTotal } = getCategorySums();


  const RecurringBill = () => {
    return (
      <div>
        {recurring.slice(-4).map((bill) => (
          <div>
            <p>{bill.name}</p>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className={styles.area}>
      <div className={commonStyles.summary}>
        <header className={commonStyles.header}>
          <h2>Recurring Bills</h2>
          <Link
            className={commonStyles.link}
            to={{
              pathname: "recurring",
            }}
          >
            <p>View All</p>
            <img src={rightArrow} alt="navigation to page" />
          </Link>
        </header>
        <div className={styles.category}>
          <div className={`${styles.category__container} ${styles.paid}`}>
            <p>Paid Bills</p>
            {paidTotal === 0 ? (
              <p>no recent bills paid</p>
            ) : (
              `${Math.abs(paidTotal)}`
            )}
          </div>
          <div className={`${styles.category__container} ${styles.soon}`}>
            <p>Due Soon</p>
            {dueSoonTotal === 0 ? (
              <p>no upcoming bills</p>
            ) : (
              `${Math.abs(dueSoonTotal)}`
            )}
          </div>
          <div className={`${styles.category__container} ${styles.upcoming}`}>
            <p>Upcoming Bills</p>
            {upcomingTotal === 0 ? (
              <p>no bills for the rest of the month</p>
            ) : (
              `${Math.abs(upcomingTotal)}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringSummary;

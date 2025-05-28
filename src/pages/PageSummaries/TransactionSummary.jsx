import { Link } from "react-router";
import rightArrow from "../../assets/images/icon-caret-right.svg";
import commonStyles from "../../styles/commonsummary.module.css";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import styles from "../../styles/transactionssummary.module.css";
import { formatDate } from "../../utils/General"
import { useAuth } from "../../context/authContext"
import { useTransaction } from '../../context/transactionContext'

const TransactionsSummary = () => {
  const { startData, user } = useAuth();
  const { transactions } = useTransaction()
  
  // Function to generate a consistent color based on the sender's name
  const getAvatarColor = (name) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#A29BFE'
    ];
    
    // Simple hash function to get consistent color for same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Function to get the first letter of the sender's name
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const RecentTransactions = () => {
    return (
      <ul className={styles.list}>
        {transactions.slice(-5).map((item, index) => (
          <li key={index} className={styles.list__item}>
            <div className={styles.list__from}>
              {/* Check if item has an avatar image, if not use generated avatar */}
              {item.avatar ? (
                <img
                  className={styles.avatar}
                  src={item.avatar}
                  alt="profile picture"
                />
              ) : (
                <div 
                  className={styles.avatar}
                  style={{
                    backgroundColor: getAvatarColor(item.name),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {getInitial(item.name)}
                </div>
              )}
              <p className={styles.sender}>{item.name}</p>
            </div>
            <div className={styles.list__receipt}>
              <p
                className={`${item.amount > 0 ? `${styles.deposit}` : ""} ${
                  styles.transaction
                }`}
              >
                {item.amount > 0
                  ? `+$${item.amount.toFixed(2)}`
                  : `-$${Math.abs(item.amount).toFixed(2)}`}
              </p>
              <p className={styles.date}>{formatDate(item.date)}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.area}>
      <div className={commonStyles.summary}>
        <header className={commonStyles.header}>
          <h2>Transaction</h2>
          <Link
            className={commonStyles.link}
            to={{
              pathname: "transactions",
            }}
          >
            <p>View All</p>
            <img src={rightArrow} alt="navigation to page" />
          </Link>
        </header>
        <RecentTransactions />
      </div>
    </div>
  );
};

export default TransactionsSummary;
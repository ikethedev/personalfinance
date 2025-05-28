import { Link } from "react-router";
import rightArrow from "../../assets/images/icon-caret-right.svg";
import bankIcon from "../../assets/images/icon-pot.svg";
import "../../styles/root.css";
import styles from "../../styles/potsummary.module.css";
import commonStyles from "../../styles/commonsummary.module.css";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../context/authContext"
import { usePot } from "../../context/potContext"




const PotsSummary = () => {
  const { startData, user } = useAuth();
  const { fetchPots } = usePot();
  const [pots, setPots] = useState([]);


  useEffect(() => {
    console.log("User id: " + user.id)
    if (user?.id) {
      fetchPots(user.id).then((data) => {
        if (Array.isArray(data)) {
          setPots(data.slice(0, 4)); // only take the first 4
        }
      });
    }
  }, [user?.id]);


  const totaledSaved = pots.reduce((acc, cur) => acc + cur.total, 0)

  const RecentPots = pots.slice(-4).map(pot => (
    <div className={styles.pot__container}>
      <div className={styles.pot__color}  style={{backgroundColor: `${pot.theme}`}}></div>
      <div className={styles.pot__info}>
        <h4 className={styles.pot__title}>{pot.name}</h4>
        <p className={styles.pot__amount}>{pot.total.toFixed(2)}</p>
    </div> 
  </div>
  )
)

  

  
  return (
    <div className={styles.area}>
      <div className={commonStyles.summary}>
        <header className={commonStyles.header}>
          <h2>Pots</h2>
          <Link
            className={commonStyles.link}
            to={{
              pathname: "pots",
            }}
          >
            <p>See Details</p>
            <img src={rightArrow} alt="navigation to page" />
          </Link>
        </header>
        <div className={styles["pot__summary-container"]}>
          <div className={styles["pot__summary"]}>
            <img src={bankIcon} alt="pots icon" />
            <div className={styles["pot__summary-info"]}>
              <h3 className={styles.title}>Total Saved</h3>
              <p className={styles["saved__amount"]}>${totaledSaved.toFixed(2)}</p>
            </div>
          </div>
          <div className={styles.pot__current}>
            {RecentPots}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotsSummary;

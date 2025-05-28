import hidePassword from "../assets/images/icon-hide-password.svg";
import { useState } from "react";
import styles from "../styles/commonform.module.css";
import { useAuth } from "../context/authContext";

const LoginForm = ({ toggleSignUp }) => {
  const [showPassword, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  const { showProfile } = useAuth();

  function togglePasswordView() {
    setShowPass(!showPassword);
  }

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    showProfile(email, password)
    
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.form__header}>Login</h2>
      
      {loginError && (
        <div className={styles.error_message}>
          {loginError}
        </div>
      )}
      
      <div>
        <label htmlFor="email">Email</label>
        <div className={styles["form__input-container"]}>
          <input
            className={styles.form__input}
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <div className={styles["form__input-container"]}>
          <input
            className={styles.form__input}
            type={showPassword ? "text" : "password"}
            value={password}
            name="password"
            id="password"
            onChange={handlePasswordChange}
           
          />
          <img
            onClick={togglePasswordView}
            src={hidePassword}
            alt="hide password"
            className={styles.hide__icon}
          />
        </div>
      </div>

      <button 
        className={styles.submit__btn} 
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <div className={styles["form__view-toggle"]}>
        <p className={styles.toggle__text}>
          Need to create an account?{" "}
          <a className={styles.link} onClick={toggleSignUp}>
            Sign Up
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
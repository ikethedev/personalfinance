import React, { useState } from "react";
import hidePassword from "../assets/images/icon-hide-password.svg";
import styles from  "../styles/commonform.module.css";
import errorIcon from "../assets/images/errorIcon.svg"
import { useDebouncedCallback } from "use-debounce";
import { useAuth } from "../context/authContext"
import { supabase } from '../backend/supabaseClient';

const SignUp = ({ toggleSignUp }) => {
  const { registerUser } = useAuth();
  const [showPassword, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  const passwordRequirements = [
    { message: "At least 6 characters", valid: password.length >= 6 },
    { message: "At least one uppercase letter", valid: /[A-Z]/.test(password) },
    { message: "At least one number", valid: /\d/.test(password) },
    {
      message: "At least one special character",
      valid: /[@$!%*?&]/.test(password),
    },
  ];

  function togglePasswordView() {
    setShowPass(!showPassword);
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    validateEmail(emailValue);
  };

  const validateEmail = useDebouncedCallback((inputEmail) => {
    if (!inputEmail || !emailRegex.test(inputEmail)) {
      setIsErrorEmail(true);
    } else {
      setIsErrorEmail(false);
    }
  }, 3000);

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    validatePassword(passwordValue);
  };

  const validatePassword = useDebouncedCallback((inputPassword) => {
    if (!inputPassword || !passwordRegex.test(inputPassword)) {
      setIsErrorPassword(true);
    } else {
      setIsErrorPassword(false);
    }
  });

  function togglePasswordView() {
    setShowPass(!showPassword);
  }

  const createUser = async (e) => {
    e.preventDefault();

    if (!username) {
      alert("Please enter a username");
      return;
    }
    
    if (isErrorEmail || !email) {
      alert("Please enter a valid email");
      return;
    }
    
    if (isErrorPassword || !password) {
      alert("Please enter a valid password");
      return;
    }
    
    try{
      await registerUser(email, password, username);
      alert("Account created successfully!"); // Added success message
    } catch (err) {
      alert("Error creating account: " + err.message); // Added user-friendly error
      console.error(err.message);
    }
  };

  return (
    <form className={styles.form}>
      <h2 className={styles.form__header}>Sign Up</h2>
      <div >
        <label htmlFor="username">Username</label>
        <div className={styles["form__input-container"]}>
          <input
            className={styles.form__input}
            onChange={handleUsernameChange}
            type="text"
            name="username"
            id="username"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <div className={styles["form__input-container"]}>
          <input
           className={styles.form__input}
            type="text"
            name="email"
            id="email"
            onChange={handleEmailChange}
          />
        </div>
        {isErrorEmail ? (
          <div  className={styles.error__email}>
            <p>Enter a valid Email</p>
            <img className={styles.error__icon} src={errorIcon} alt="error icon" />
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <div className={styles["form__input-container"]}>
          <input
             className={styles.form__input}
            type={showPassword ? "text" : "password"}
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
        {isErrorPassword ? (
          <ul className="password__requirements">
            {passwordRequirements.map((req, index) => (
              <li key={index} style={{ color: req.valid ? "rgb(39, 124, 120)" : "rgb(201, 71, 54)" }}>
                {req.message} 
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </div>

      <button className={styles.submit__btn} onClick={createUser}>Sign Up</button>

      <div className={styles["form__view-toggle"]}>
        <p className={styles.toggle__text}>
          Already have an account?
          <a className={styles.link} onClick={toggleSignUp}>
          Login
          </a>
        </p>
      </div>
    </form>
  );
};

export default SignUp;

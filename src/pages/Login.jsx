import { useState } from "react";
import logoLarge from "../assets/images/illustration-authentication.svg";
import LoginForm from "./LoginForm";
import SignUp from "./Signup";
import "../styles/root.css";
import commonForm from "../styles/commonform.module.css";

const Login = () => {
    const [showSignUp, setShowSignUp] = useState(false);
    
    const toggleSignUp = (e) => {
        if (e) e.preventDefault();
        setShowSignUp(!showSignUp);
    };

    return (
        <div className={commonForm.auth__page}>
            <header className={commonForm.mobile__header}>
                {/* Mobile header - empty img tag was here */}
            </header>
            <div className={commonForm.illustration__container}>
                <img src={logoLarge} alt="Authentication illustration" className="auth__illustration" />
            </div>
            <div className={commonForm.form__container}>
                {showSignUp ? (
                    <SignUp toggleSignUp={toggleSignUp} />
                ) : (
                    <LoginForm toggleSignUp={toggleSignUp} />
                )}
            </div>
        </div>
    );
};

export default Login;
import React from 'react'
import './Login.css';
import google_logo from '../../assets/google_logo.png';
import login_img from '../../assets/login_img.png'
import apiHost from '../../components/utils/api';
import { useState, useEffect } from 'react';
import CustomizedSwitches from '../../components/appLayout/toggleTheme';

function Login() {

    // const [theme, setTheme] = useState("light");

    // useEffect(() => {
    //     const preferredTheme = localStorage.getItem("preferredTheme") || "light";
    //     setTheme(preferredTheme);
    // }, []);

    const handleGoogleLogin = () => {
        console.log("asdjbdhjbd")
        window.location.href = `${apiHost}/api/auth/google`;
    };
    return (
        <div className='total-login'>
            <div style={{ display: "none" }}>
                <CustomizedSwitches />
            </div>
            <div className='login-card'>
                <div className='login-img-div'>
                    <img style={{ height: "100%" }} src={login_img} alt="" />
                </div>
                <button className="signin-button" onClick={handleGoogleLogin}>
                    <img style={{ backgroundColor: "white", padding: "5px 3px", borderRadius: "10px" }} src={google_logo} alt="GoogleImage" className="google-logo" />
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}

export default Login

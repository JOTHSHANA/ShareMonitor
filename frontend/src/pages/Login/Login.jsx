import React from 'react'
import './Login.css';
import google_logo from '../../assets/google_logo.png';
import login_img from '../../assets/login_img.jpg'
import apiHost from '../../components/utils/api';

function Login() {
    const handleGoogleLogin = () => {
        console.log("asdjbdhjbd")
      window.location.href = `${apiHost}/auth/google`;
    };
    return (
        <div className='total-login'>
            <div className='login-card'>
                <div className='login-img-div'>
                    <img style={{height:"100%"}} src={login_img} alt="" />
                </div>
                <button className="signin-button" onClick={handleGoogleLogin}>
            <img style={{backgroundColor:"white", padding:"5px 3px", borderRadius:"10px"}} src={google_logo} alt="GoogleImage" className="google-logo" />
            Sign in with Google
          </button>
            </div>
        </div>
    )
}

export default Login

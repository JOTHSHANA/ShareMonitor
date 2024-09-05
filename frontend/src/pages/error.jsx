import React, { useState, useEffect } from "react";
import "./Login/Login.css";
import { Link } from "react-router-dom";
import error from "../assets/error.png"
import '../pages/Login/Login.css';
import CustomizedSwitches from "../components/appLayout/toggleTheme";
function Error() {

  return (
    <div className="error-page">
      <div style={{display:"none"}}><CustomizedSwitches/></div>
      <div className="error-card">
        <img style={{ height: "60%" }} src={error} alt="404" className="error-img" />
        <p
          style={{
            margin: "0px",
            color: "#1c0c6a",
            fontWeight: "700",
            fontSize:"20px"
          }}
        >
          OOPS! PAGE NOT FOUND
        </p>
        <Link style={{ fontWeight: "700" }} to="/subjects">
          BACK TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}

export default Error;

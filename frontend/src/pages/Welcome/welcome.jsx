import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";  // Import CryptoJS
import CustomizedSwitches from "../../components/appLayout/toggleTheme";
const secretKey = "your-secret-key";

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// Function to decrypt data
export const decryptData = (encryptedData) => {
  if (!encryptedData) return null;
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const Welcome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Secret key for encryption and decryption
  // Use a secure key

  // Function to encrypt data


  useEffect(() => {
    const dataParam = searchParams.get("data");

    if (dataParam) {
      const data = JSON.parse(decodeURIComponent(dataParam));
      const { token, name, role, id, gmail, profilePhoto } = data;

      // Encrypt and set the cookie values
      Cookies.set("token", encryptData(token), { expires: 1 });
      Cookies.set("name", encryptData(name));
      Cookies.set("role", encryptData(role));
      Cookies.set("id", encryptData(id));
      Cookies.set("gmail", encryptData(gmail));
      Cookies.set("profilePhoto", encryptData(profilePhoto));

      // Decrypt and log the saved data for verification
      const savedData = {
        token: decryptData(Cookies.get("token")),
        name: decryptData(Cookies.get("name")),
        role: decryptData(Cookies.get("role")),
        id: decryptData(Cookies.get("id")),
        gmail: decryptData(Cookies.get("gmail")),
        profilePhoto: decryptData(Cookies.get("profilePhoto")),
      };

      console.log("Saved JSON data:", savedData);

      if (role) {
        navigate("/subjects");
      } else {
        // Remove all cookies if the role is invalid or missing
        Cookies.remove("token");
        Cookies.remove("name");
        Cookies.remove("id");
        Cookies.remove("role");
        Cookies.remove("profilePhoto");
        Cookies.remove("gmail");
      }
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <div style={{ display: "none" }}><CustomizedSwitches /></div>
      <div style={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--document)" }}>
        <span className="loader"></span>
      </div>
    </div>
  );
};

export default Welcome;

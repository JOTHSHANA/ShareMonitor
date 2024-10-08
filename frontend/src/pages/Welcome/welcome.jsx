import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import CustomizedSwitches from "../../components/appLayout/toggleTheme";

const secretKey = "your-secret-key";

const Welcome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Helper function to navigate to login
  const redirectToLogin = () => {
    console.log("Token expired, redirecting to login...");
    Cookies.remove("token");  // Remove token cookie
    navigate("/materials/login");  // Navigate to login
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      const dataParam = searchParams.get("data");

      const getDecryptedCookie = (cookieName) => {
        const encryptedCookie = Cookies.get(cookieName);
        if (encryptedCookie) {
          const bytes = CryptoJS.AES.decrypt(encryptedCookie, secretKey);
          return bytes.toString(CryptoJS.enc.Utf8);
        }
        return null;
      };

      if (dataParam) {
        try {
          const decodedData = decodeURIComponent(dataParam);
          const parsedData = JSON.parse(decodedData);
          const { token, name, role, id, gmail, profilePhoto, subId, subName } = parsedData;

          // Set cookies for the parsed data, encrypting only sensitive information
          Cookies.set("token", CryptoJS.AES.encrypt(token, secretKey).toString(), { expires: 5 });
          Cookies.set("name", CryptoJS.AES.encrypt(name, secretKey).toString(), { expires: 5 });
          Cookies.set("role", CryptoJS.AES.encrypt(role.toString(), secretKey).toString(), { expires: 5 });
          Cookies.set("id", CryptoJS.AES.encrypt(id.toString(), secretKey).toString(), { expires: 5 });
          Cookies.set("gmail", CryptoJS.AES.encrypt(gmail, secretKey).toString(), { expires: 5 });
          Cookies.set("profilePhoto", CryptoJS.AES.encrypt(profilePhoto, secretKey).toString(), { expires: 5 });

          // Set cookies for subId and subName without encryption
          Cookies.set("subId", subId, { expires: 5 });
          Cookies.set("subName", subName, { expires: 5 });

          // Encrypt and update allowedRoutes
          const routes = ["/materials/subjects", `/materials/levels/${subId}/${subName}`, "/materials/trash"];
          console.log("Updated routes:", routes);

          Cookies.set("allowedRoutes", CryptoJS.AES.encrypt(JSON.stringify(routes), secretKey).toString(), { expires: 1 });

          const redirectPath = routes.length > 0 ? routes[0] : "/materials/error";

          // Navigate to the first allowed route
          setTimeout(() => {
            navigate(redirectPath);
          }, 200);

          // Set timeout to redirect to login after 5 hours (18000000 milliseconds)
          setTimeout(() => {
            redirectToLogin();
          }, 5 * 60 * 60 * 1000);  // 5 hours in milliseconds

        } catch (error) {
          console.error("Error processing data:", error);

          const cookiesToRemove = ["token", "name", "role", "id", "gmail", "profilePhoto", "subId", "subName", "allowedRoutes"];
          cookiesToRemove.forEach((key) => Cookies.remove(key));

          navigate("/materials/error");
        }
      } else {
        // Check if cookies are already set (in case of a refresh)
        const token = getDecryptedCookie("token");
        const name = getDecryptedCookie("name");
        const role = getDecryptedCookie("role");
        const id = getDecryptedCookie("id");
        const gmail = getDecryptedCookie("gmail");
        const profilePhoto = getDecryptedCookie("profilePhoto");
        const subId = Cookies.get("subId");
        const subName = Cookies.get("subName");

        if (token && name && role && id && gmail && profilePhoto && subId && subName) {
          const allowedRoutes = JSON.parse(CryptoJS.AES.decrypt(Cookies.get("allowedRoutes"), secretKey).toString(CryptoJS.enc.Utf8));

          console.log("Existing routes from cookies:", allowedRoutes);

          const redirectPath = allowedRoutes.length > 0 ? allowedRoutes[0] : `/materials/levels/${subId}/${subName}`;

          setTimeout(() => {
            navigate(redirectPath);
          }, 200);

          // Check the expiration time of the token and set the timeout accordingly
          const expirationTime = new Date(Cookies.getJSON().token.expires).getTime();
          const currentTime = new Date().getTime();
          const timeRemaining = expirationTime - currentTime;

          if (timeRemaining > 0) {
            setTimeout(() => {
              redirectToLogin();
            }, timeRemaining);
          } else {
            redirectToLogin();  // If the token is already expired, redirect immediately
          }

        } else {
          // If cookies are missing, redirect to error page
          navigate("/materials/error");
        }
      }
    };

    fetchRoutes();
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

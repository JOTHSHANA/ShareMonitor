import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import CustomizedSwitches from "../../components/appLayout/toggleTheme";

const secretKey = "your-secret-key";

const Welcome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

          // Set cookies for the parsed data
          Cookies.set("token", CryptoJS.AES.encrypt(token, secretKey).toString(), { expires: 1 });
          Cookies.set("name", CryptoJS.AES.encrypt(name, secretKey).toString(), { expires: 1 });
          Cookies.set("role", CryptoJS.AES.encrypt(role.toString(), secretKey).toString(), { expires: 1 });
          Cookies.set("id", CryptoJS.AES.encrypt(id.toString(), secretKey).toString(), { expires: 1 });
          Cookies.set("gmail", CryptoJS.AES.encrypt(gmail, secretKey).toString(), { expires: 1 });
          Cookies.set("profilePhoto", CryptoJS.AES.encrypt(profilePhoto, secretKey).toString(), { expires: 1 });
          Cookies.set("subId", CryptoJS.AES.encrypt(subId, secretKey).toString(), { expires: 1 });
          Cookies.set("subName", CryptoJS.AES.encrypt(subName, secretKey).toString(), { expires: 1 });

          // const response = await axios.get(`/api/resources?role=${role}`);
          // const routes = response.data.map(route => route.path);
          const routes = ["/subjects", `/levels/${subId}/${subName}`, "/trash",];
          Cookies.set("allowedRoutes", CryptoJS.AES.encrypt(JSON.stringify(routes), secretKey).toString(), { expires: 1 });

          const redirectPath = routes.length > 0 ? routes[0] : "/error";

          setTimeout(() => {
            navigate(redirectPath);
          }, 200);

        } catch (error) {
          console.error("Error processing data:", error);

          const cookiesToRemove = ["token", "name", "role", "id", "gmail", "profilePhoto", "subId", "subName", "allowedRoutes"];
          cookiesToRemove.forEach((key) => Cookies.remove(key));

          navigate("/error");
        }
      } else {
        // Check if cookies are already set (in case of a refresh)
        const token = getDecryptedCookie("token");
        const name = getDecryptedCookie("name");
        const role = getDecryptedCookie("role");
        const id = getDecryptedCookie("id");
        const gmail = getDecryptedCookie("gmail");
        const profilePhoto = getDecryptedCookie("profilePhoto");
        const subId = getDecryptedCookie("subId");
        const subName = getDecryptedCookie("subName");

        if (token && name && role && id && gmail && profilePhoto && subId && subName) {
          const allowedRoutes = JSON.parse(CryptoJS.AES.decrypt(Cookies.get("allowedRoutes"), secretKey).toString(CryptoJS.enc.Utf8));
          const redirectPath = allowedRoutes.length > 0 ? allowedRoutes[0] : `/levels/${subId}/${subName}`;

          setTimeout(() => {
            navigate(redirectPath);
          }, 200);
        } else {
          // If cookies are missing, redirect to error page
          navigate("/error");
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

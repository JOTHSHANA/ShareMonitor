import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Welcome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const dataParam = searchParams.get("data");

    if (dataParam) {
      const data = JSON.parse(decodeURIComponent(dataParam));
      const { token, name, role, id,gmail, profilePhoto } = data;

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("name", name);
      Cookies.set("role", role);
      Cookies.set("id", id);
      Cookies.set("gmail",gmail)
      Cookies.set('profilePhoto', profilePhoto)

      const savedData = {
        token: Cookies.get("token"),
        name: Cookies.get("name"),
        role: Cookies.get("role"),
        id: Cookies.get("id"),
        gmail:Cookies.get("gmail"),
        profilePhoto:Cookies.get("profilePhoto")
      };
      console.log("Saved JSON data:", savedData);
      if (role === 1) {
        navigate("/subjects");
      }
      else {
        navigate('/subjects')
      }
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <div style={{ height: "80vh", width: "88vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span class="loader"></span>
      </div>
    </div>
  );
};

export default Welcome;

import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import Subjects from "./pages/BookSlots";
import Levels from "./pages/Levels";
import History from "./pages/History";
import Trash from "./pages/Trash";
import Login from "./pages/Login/Login";
import Welcome from "./pages/Welcome/welcome";
import { useState, useEffect } from 'react';
import Error from "./pages/error";
import CryptoJS from "crypto-js";
import AppLayout from "./components/appLayout/Layout";

const ProtectedRoute = ({ children }) => {
  const secretKey = "your-secret-key";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const detoken = Cookies.get("token");
      const allowedRoutes = Cookies.get("allowedRoutes");

      if (detoken && allowedRoutes) {
        try {
          const token = CryptoJS.AES.decrypt(detoken, secretKey).toString(CryptoJS.enc.Utf8);
          const routes = JSON.parse(CryptoJS.AES.decrypt(allowedRoutes, secretKey).toString(CryptoJS.enc.Utf8));
          const currentPath = window.location.pathname;

          if (token && routes.includes(currentPath)) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token or route decryption error:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [secretKey]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/error'); 
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <div className="loader"></div>; 
  }

  return isAuthenticated ? children : null;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/error" element={<Error />} />

        {/* Protected Routes */}
        <Route path="/*"
          element={
            <AppLayout body={<Routes>
              <Route
                path="/subjects"
                element={<ProtectedRoute><Subjects /></ProtectedRoute>}
              />
              <Route
                path="/levels/:subjectId/:subjectName"
                element={<ProtectedRoute><Levels /></ProtectedRoute>}
              />
              <Route
                path="/history"
                element={<ProtectedRoute><History /></ProtectedRoute>}
              />
              <Route
                path="/trash"
                element={<ProtectedRoute><Trash /></ProtectedRoute>}
              />
              </Routes>} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
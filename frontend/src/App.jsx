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

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    const check = async () => {
      if (Cookies.get('token')) {
        setIsLogin(true)
      } else {
        navigate('/login')
        setIsLogin(false)
      }
    }
    check();
  }, [navigate])

  if (isLogin) {
    return children;

  }
  return null;

};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="*" element={<Error />} />

        {/* Protected Routes */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
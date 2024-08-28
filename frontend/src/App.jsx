import { BrowserRouter, Routes, Route } from "react-router-dom";
import Subjects from "./pages/BookSlots";
import Levels from "./pages/Levels";
import History from "./pages/History";
import Trash from "./pages/Trash";
import Login from "./pages/Login/Login";
import Welcome from "./pages/Welcome/welcome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/levels/:subjectId/:subjectName" element={<Levels />} />
        <Route path="/history" element={<History />} />
        <Route path="/trash" element={<Trash />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

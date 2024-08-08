import { BrowserRouter, Routes, Route } from "react-router-dom";
import Subjects from "./pages/BookSlots";
import Levels from "./pages/Levels";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Subjects />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/levels/:subjectId/:subjectName" element={<Levels />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

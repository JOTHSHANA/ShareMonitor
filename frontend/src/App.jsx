import { BrowserRouter, Routes, Route } from "react-router-dom";
import Subjects from "./pages/BookSlots";
import Levels from "./pages/Levels";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Subjects />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/levels/:subjectId/:subjectName" element={<Levels />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

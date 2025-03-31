import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CreationPage from "./pages/CreationPage";
import QuizPage from "./pages/QuizPage";
import EditPage from "./pages/EditPage";
import ResultPage from "./pages/ResultPage";

import "./App.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header>
      <h1>Questionnaire</h1>
      {location.pathname === "/" && (
        <button onClick={() => navigate("/create")}>Create Quiz</button>
      )}
    </header>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<CreationPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/results/:resultId" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
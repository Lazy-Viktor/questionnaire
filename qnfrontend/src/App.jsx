import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import MainPage from "./pages/MainPage";
import CreationPage from "./pages/CreationPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage"

function App() {
  
  return (
    <Router>
      <header>
        <h1>Questionnaire</h1>
      </header>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<CreationPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/results/:resultId" element={<ResultPage />} />
      </Routes>
    </Router>
  )
}

export default App

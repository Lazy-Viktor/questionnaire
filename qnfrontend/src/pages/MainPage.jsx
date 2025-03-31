import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import Modal from "./child-components/Modal"

import './pages.css';

function MainPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [sortOption, setSortOption] = useState("date");

  const [actionModal, setActionModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/surveys`)
        .then(response => response.json())
        .then(data => setQuizzes(data))
        .catch(error => console.error("Error fetching quizzes:", error));
  }, []);

  const sortedQuizzes = [...quizzes].sort((a, b) => {
    switch (sortOption) {
        case "name":
            return a.title.localeCompare(b.title);
        case "questions":
            return b.questions.length - a.questions.length;
        case "date":
        default:
            return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const handleActionClick = (surveyId, action) => {
    setSelectedSurvey(surveyId);
    setPassword("");
    setError("");
    setActionModal(action);
    setModalTitle(action === "edit" ? "Enter password to edit" : "Enter password to delete");
    setIsModalOpen(true);
  };
  
  const handlePasswordSubmit = async () => {
    if (!selectedSurvey) return;
  
    try {
      const response = await fetch(`${API_URL}/api/surveys/check-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId: selectedSurvey, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (actionModal === "edit") {
          navigate(`/edit/${selectedSurvey}`);
        } else if (actionModal === "delete") {
          await deleteQuiz(selectedSurvey);
        }
        setActionModal(null);
      } else {
        setError(data.message || "Incorrect password");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };
  
  const deleteQuiz = async (quizId) => {
    try {
      const response = await fetch(`${API_URL}/api/surveys/${quizId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Quiz deleted successfully!");
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
      } else {
        setError(result.message || "Incorrect password");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      setError("Server error. Please try again.");
    }
  };


  return (
    <div className="component-style">
      <h2>Quiz Catalog</h2>

      <div className="sort-container">
        <label>Sort by:</label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="date">Creation Date</option>
          <option value="name">Name</option>
          <option value="questions">Question Count</option>
        </select>
      </div>

      
      <div className="quiz-list">
                {sortedQuizzes.map((quiz, index) => (
                    <div key={index} className="quiz-card">
                        <h2>{quiz.title}</h2>
                        <p>{quiz.description}</p>
                        <p><strong>Questions:</strong> {quiz.questions.length}</p>
                        <p>Played: {quiz.timesPlayed} times</p>
                        <p><strong>Created by:</strong> {quiz.createdBy}</p>
                        <div className="button-container">
                          <button className="start" onClick={() => navigate(`/quiz/${quiz._id}`)}>Start Quiz</button>
                          <button className="edit" onClick={() => handleActionClick(quiz._id, "edit")}>Edit</button>
                          <button className="delete" onClick={() => handleActionClick(quiz._id, "delete")}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                  <button onClick={handlePasswordSubmit}>
                    {actionModal === "edit" ? "Edit" : "Delete"}
                  </button>
                  {error && <p style={{ color: "red" }}>{error}</p>}
            </Modal>
    </div>
  );
}

export default MainPage;

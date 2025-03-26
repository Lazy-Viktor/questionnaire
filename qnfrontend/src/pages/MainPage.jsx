import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "..config";

function MainPage() {
  const [quizzes, setQuizzes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/surveys`)
        .then(response => response.json())
        .then(data => setQuizzes(data))
        .catch(error => console.error("Error fetching quizzes:", error));
}, []);

  return (
    <main>
      <h2>Quiz Catalog</h2>
      <button onClick={() => navigate("/create")}>Create Quiz</button>

      <div>
                {quizzes.map((quiz, index) => (
                    <div key={index} className="quiz-card">
                        <h2>{quiz.title}</h2>
                        <p>{quiz.description}</p>
                        <p><strong>Created by:</strong> {quiz.createdBy}</p>
                        <button onClick={() => navigate(`/quiz/${quiz._id}`)}>Start Quiz</button>
                    </div>
                ))}
            </div>
    </main>
  );
}

export default MainPage;

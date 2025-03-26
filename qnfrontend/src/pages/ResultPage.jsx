import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "..config";

function ResultPage() {
  const navigate = useNavigate();
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);

  // Fetch Result Data
useEffect(() => {
  if (!resultId || resultId === "undefined") {
    console.error("Invalid resultId:", resultId);
    return;
  }

  console.log("Fetching result with ID:", resultId);

  fetch(`${API_URL}/api/results`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (!data || !data.quizId) {
        throw new Error("Invalid result data received");
      }
      console.log("Fetched result:", data);
      setResult(data);
    })
    .catch((err) => {
      console.error("Error fetching result:", err);
      setError(err.message);
    });
}, [resultId]);

// Fetch Quiz Data
useEffect(() => {
  if (!result?.quizId?._id) {
    return;
  }

  const quizId = result.quizId._id;
  console.log("Fetching quiz with ID:", quizId);

  fetch(`${API_URL}/api/surveys`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Fetched quiz:", data);
      setQuiz(data);
    })
    .catch((err) => {
      console.error("Error fetching quiz:", err);
      setError(err.message);
    });
}, [result]);


  if (error) return <p>Error: {error}</p>;
  if (!result || !quiz) return <p>Loading...</p>;

  return (
    <div>
      <h2>Результати {result.userName}</h2>
      {quiz.questions.map((question, index) => {
        const userAnswer = result.answers[index].answer;
        const correctAnswers = question.correctAnswers;
        const answerOptions = question.answers;
        
        let isCorrect = false;
        if (question.type === "text") {
          isCorrect = result.answers[index].answer.toLowerCase() === question.answers[0].toLowerCase();
        } else if (question.type === "single_choice") {
          const userAnswerIndex = answerOptions.indexOf(userAnswer);
          isCorrect = userAnswerIndex !== -1 && correctAnswers[userAnswerIndex] === true;
        } else if (question.type === "multiple_choice") {
          isCorrect = userAnswer.every(ans => {
          const answerIndex = answerOptions.indexOf(ans);
          return answerIndex !== -1 && correctAnswers[answerIndex] === true;
        }) && correctAnswers.every((isCorrect, idx) => !isCorrect || userAnswer.includes(answerOptions[idx]));
        }

        return (
          <div key={question._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <h3>{question.text}</h3>
            <p><strong>Ваша відповідь:</strong> {Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer}</p>
            {question.type === "multiple_choice" && (
                <ul>
                  {userAnswer.map((ans, i) => {
                    const answerIndex = answerOptions.indexOf(ans);
                    const isCorrect = answerIndex !== -1 && correctAnswers[answerIndex] === true;
                    
                    return (
                      <li key={i} style={{ color: isCorrect ? "green" : "red" }}>
                        {ans} - {isCorrect ? "Correct" : "Wrong"}
                      </li>
                    );
                  })}
                </ul>
            )}
            {question.type !== "multiple_choice" && (
              <p style={{ color: isCorrect ? "green" : "red" }}>
                {isCorrect ? "Correct" : "Wrong"}
              </p>
            )}
          </div>
        );
      })}

      <button onClick={() => navigate("/")} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Return to Main Page
      </button>
    </div>
  );
};

export default ResultPage;
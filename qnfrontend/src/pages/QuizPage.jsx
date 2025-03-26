import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [userName, setUserName] = useState("");
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/surveys/${id}`);
                const data = await response.json();
                console.log("Fetched Quiz Data:", data);
                setQuiz(data);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };

        fetchQuiz();
    }, [id]);

    const handleAnswerChange = (questionIndex, value, isCheckbox = false) => {
        setAnswers((prev) => {
            const updatedAnswers = { ...prev };

            if (isCheckbox) {
                const currentAnswers = updatedAnswers[questionIndex] || [];
                if (currentAnswers.includes(value)) {
                    updatedAnswers[questionIndex] = currentAnswers.filter((item) => item !== value);
                } else {
                    updatedAnswers[questionIndex] = [...currentAnswers, value];
                }
            } else {
                updatedAnswers[questionIndex] = value;
            }

            return updatedAnswers;
        });
    };

    const handleSubmit = async () => {
        if (!userName) {
          alert("Please enter your name before submitting.");
          return;
        }
      
        if (!id) {
          console.error("Quiz ID is missing!");
          alert("Error: Quiz ID is missing.");
          return;
        }
      
        const resultData = {
          quizId: id,
          userName,
          answers: quiz.questions.map((q, index) => ({
            questionId: q._id,
            answer: answers[index] || ""
          }))
        };
      
        try {
          const response = await fetch("http://localhost:5000/api/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resultData),
          });
      
          const result = await response.json();
          console.log("Server response:", result);
      
          if (response.ok && result.resultId) {
            alert("Your answers have been submitted!");
            console.log("Navigating to:", `/results/${result._id}`);
            navigate(`/results/${result.resultId}`);
          } else {
            console.error("Failed to submit answers. Server response:", result);
            alert("Failed to submit answers. Please try again.");
          }
        } catch (error) {
          console.error("Error submitting answers:", error);
          alert("An error occurred while submitting your answers.");
        }
      };
      

    if (!quiz) return <h2>Loading...</h2>;

    return (
        <div>
            <h1>{quiz.title}</h1>
            <p><strong>Description:</strong> {quiz.description}</p>
            <p><strong>Created by:</strong> {quiz.createdBy}</p>

            <div style={{ marginBottom: "20px" }}>
                <label>
                    <strong>Your Name:</strong>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        style={{ marginLeft: "10px", padding: "5px" }}
                    />
                </label>
            </div>

            <div>
                {quiz.questions.map((question, index) => (
                    <div key={index} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                        <h3>{question.questionText}</h3>

                        {question.type === "text" && (
                            <input
                                type="text"
                                value={answers[index] || ""}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder="Enter your answer"
                            />
                        )}

                        {question.type === "single_choice" && question.answers?.length > 0 && (
                            <div>
                                <p>Options:</p>
                                {question.answers.map((option, i) => (
                                    <label key={i} style={{ display: "block", marginTop: "5px" }}>
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option}
                                            checked={answers[index] === option}
                                            onChange={() => handleAnswerChange(index, option)}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        )}

                        {question.type === "multiple_choice" && question.answers?.length > 0 && (
                            <div>
                                <p>Options:</p>
                                {question.answers.map((option, i) => (
                                    <label key={i} style={{ display: "block", marginTop: "5px" }}>
                                        <input
                                            type="checkbox"
                                            value={option}
                                            checked={answers[index]?.includes(option) || false}
                                            onChange={() => handleAnswerChange(index, option, true)}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={handleSubmit}>Submit Answers</button>
        </div>
    );
};

export default QuizPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config";

import './pages.css';

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${API_URL}/api/surveys/${id}`);
        if (!response.ok) throw new Error("Failed to fetch quiz");

        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setCreatedBy(data.createdBy);
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error loading quiz:", error);
      }
    };

    fetchQuiz();
  }, [id]);

  const updateQuestion = (qId, key, value) => {
    setQuestions(questions.map((q) =>
      q._id === qId ? { ...q, [key]: value, answers: key === "type" ? [] : q.answers, correctAnswers: [] } : q
    ));
  };

  const updateChoice = (qId, index, value) => {
    setQuestions(questions.map((q) => {
      if (q._id === qId) {
        const newAnswers = [...q.answers];
        newAnswers[index] = value;
        return { ...q, answers: newAnswers };
      }
      return q;
    }));
  };

  const toggleCorrectAnswer = (qId, index) => {
    setQuestions(questions.map((q) => {
      if (q._id === qId) {
        if (q.type === "single_choice") {
          const newCorrectAnswers = q.correctAnswers.map((_, i) => i === index);
          return { ...q, correctAnswers: newCorrectAnswers };
        } else if (q.type === "multiple_choice") {
          const newCorrectAnswers = [...q.correctAnswers];
          newCorrectAnswers[index] = !newCorrectAnswers[index];
          return { ...q, correctAnswers: newCorrectAnswers };
        }
      }
      return q;
    }));
  };

  const handleSaveChanges = async () => {
    const updatedSurveyData = {
      title,
      description,
      createdBy,
      questions,
    };

    try {
      const response = await fetch(`${API_URL}/api/surveys/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSurveyData),
      });

      if (response.ok) {
        alert("Quiz updated successfully!");
        navigate("/");
      } else {
        console.error("Failed to update quiz");
      }
    } catch (error) {
      console.error("Error updating quiz", error);
      alert("Error updating quiz.");
    }
  };

  return (
    <div className="component-style">
      <h2>Edit Quiz</h2>

      <div className="form-row">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="form-row">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea-field"
        />
      </div>

      <div className="form-row">
        <label>Created by:</label>
        <input
          type="text"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="input-field"
        />
      </div>

      <h3>Questions</h3>
      {questions.map((q, index) => (
        <div key={q._id} className="question-container">
          <h4>Question {index + 1}</h4>

          <div className="question-header">
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => updateQuestion(q._id, "questionText", e.target.value)}
              className="question-input"
            />

            <select
              value={q.type}
              onChange={(e) => updateQuestion(q._id, "type", e.target.value)}
              className="question-type-select"
            >
              <option value="text">Text</option>
              <option value="single_choice">Single Choice</option>
              <option value="multiple_choice">Multiple Choice</option>
            </select>
          </div>

          {q.type === "text" && (
            <input
              type="text"
              value={q.answers[0] || ""}
              onChange={(e) => updateChoice(q._id, 0, e.target.value)}
              className="input-field"
            />
          )}

          {(q.type === "single_choice" || q.type === "multiple_choice") && (
            <div>
              {q.answers.map((answer, idx) => (
                <div key={idx} className="choice-container">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => updateChoice(q._id, idx, e.target.value)}
                    className="choice-input"
                  />
                  <button
                    onClick={() => toggleCorrectAnswer(q._id, idx)}
                    className={`choice-btn ${q.correctAnswers[idx] ? 'correct' : 'incorrect'}`}
                  >
                    {q.correctAnswers[idx] ? "Correct" : "Incorrect"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button className="create-quiz-button" onClick={handleSaveChanges}>
        Save Changes
      </button>
    </div>

  );
}

export default EditPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

import './pages.css';

function CreationPage() {
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  const handleCreateQuiz = async () => {
    const quizData = {
      title,
      description,
      createdBy,
      password,
      questions,
    };

    try {
      const response = await fetch(`${API_URL}/api/surveys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        alert("Quiz created successfully!");
        navigate("/");
      } else {
        console.error("Failed to create quiz");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating quiz.");
    }
  };


  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), questionText: "", type: "text", answers: [], correctAnswers: [] }
    ]);
  };

  const updateQuestion = (id, key, value) => {
    setQuestions(questions.map((q) =>
      q.id === id ? { ...q, [key]: value, answers: key === "type" ? [] : q.answers, correctAnswers: [] } : q
    ));
  };

  const deleteQuestion = () => {
    setQuestions(questions.slice(0, -1));
  };

  const addChoice = (id) => {
    setQuestions(questions.map((q) => {
      if (q.id === id && q.answers.length < 8) {
        return { ...q, answers: [...q.answers, ""], correctAnswers: [...q.correctAnswers, false] };
      }
      return q;
    }));
  };

  const removeChoice = (id) => {
    setQuestions(questions.map((q) => {
      if (q.id === id && q.answers.length > 2) {
        return { ...q, answers: q.answers.slice(0, -1), correctAnswers: q.correctAnswers.slice(0, -1) };
      }
      return q;
    }));
  };

  const updateChoice = (qId, index, value) => {
    setQuestions(questions.map((q) => {
      if (q.id === qId) {
        const newAnswers = [...q.answers];
        newAnswers[index] = value;
        return { ...q, answers: newAnswers };
      }
      return q;
    }));
  };

  const toggleCorrectAnswer = (qId, index) => {
    setQuestions(questions.map((q) => {
      if (q.id === qId) {
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

  return (
    <div className="component-style">
      <h2>Create a New Quiz</h2>
      
      <div className="creation-form">
        <div>
          <label>Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter quiz title" 
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Enter quiz description" 
          />
        </div>

        <div className="input-group">
          <div>
            <label>Created by:</label>
            <input 
              type="text" 
              value={createdBy} 
              onChange={(e) => setCreatedBy(e.target.value)} 
              placeholder="Enter your name" 
            />
          </div>

          <div>
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Come up with a password" 
            />
          </div>
        </div>
      </div>

      <h3>Questions</h3> <br />
      {questions.map((q, index) => (
        <div key={q.id} className="question-container">
          <h4>Question {index + 1}</h4>
          <div className="question-header">
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => updateQuestion(q.id, "questionText", e.target.value)}
              placeholder="Enter question"
            />
            <select
              value={q.type}
              onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
            >
              <option value="text">Text</option>
              <option value="single_choice">Single Choice</option>
              <option value="multiple_choice">Multiple Choice</option>
            </select>
          </div><br />

          {(q.type === "text") && (
            <input
              type="text"
              value={q.answers[0] || ""}
              onChange={(e) => updateChoice(q.id, 0, e.target.value)}
              placeholder="Enter correct answer"
            />
          )}

          {(q.type === "single_choice") && (
            <div>
            {q.answers.map((answer, idx) => (
              <div key={idx} className="choice-container">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => updateChoice(q.id, idx, e.target.value)}
                  placeholder={`Choice ${idx + 1}`}
                />
                <button
                  className={q.correctAnswers[idx] ? "correct" : "incorrect"}
                  onClick={() => toggleCorrectAnswer(q.id, idx)}
                >
                  {q.correctAnswers[idx] ? "Correct" : "Incorrect"}
                </button>
              </div>
            ))}
            <div className="choice-buttons">
              <button
                className="add-choice"
                onClick={() => addChoice(q.id)}
                disabled={q.answers.length >= 8}
              >
                Add Choice
              </button>
              
              <button
                className="remove-choice"
                onClick={() => removeChoice(q.id)}
                disabled={q.answers.length <= 2}
              >
                Remove Choice
              </button>
            </div>
          </div>
          )}

          {(q.type === "multiple_choice") && (
            <div>
            {q.answers.map((answer, idx) => (
              <div key={idx} className="choice-container">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => updateChoice(q.id, idx, e.target.value)}
                  placeholder={`Choice ${idx + 1}`}
                />
                <button
                  className={q.correctAnswers[idx] ? "correct" : "incorrect"}
                  onClick={() => toggleCorrectAnswer(q.id, idx)}
                >
                  {q.correctAnswers[idx] ? "Correct" : "Incorrect"}
                </button>
              </div>
            ))}
            <button onClick={() => addChoice(q.id)} disabled={q.answers.length >= 8}>
              Add Choice
            </button>
            <button onClick={() => removeChoice(q.id)} disabled={q.answers.length <= 2}>
              Remove Choice
            </button>
          </div>
          )}
        </div>
      ))}
      <br />
      <div className="action-buttons">
        <button className="add-question" onClick={addQuestion}>
          Add Question
        </button>
        
        {questions.length > 0 && (
          <button className="delete-question" onClick={deleteQuestion}>
            Delete Question
          </button>
        )}
      </div>
      <br />
      <button className="create-quiz-button" onClick={handleCreateQuiz}>
        Create Quiz
      </button>
    </div>
  );
};

export default CreationPage;

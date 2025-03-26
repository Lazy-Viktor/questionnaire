import express from "express";
import mongoose from "mongoose";
import Result from "../models/Result.js";

const router = express.Router();

// Saving Result
router.post("/", async (req, res) => {
  try {
    const { quizId, userName, answers } = req.body;

    if (!quizId || !userName || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const formattedAnswers = answers.map(ans => ({
      questionId: new mongoose.Types.ObjectId(ans.questionId),
      answer: ans.answer
    }));

    const newResult = new Result({ quizId, userName, answers });
    const savedResult = await newResult.save();

    return res.status(201).json({ resultId: savedResult._id });
  } catch (error) {
    console.error("Error saving result:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


// Getting Results

router.get("/", async (req, res) => {
  try {
    const results = await Result.find().populate("quizId", "title createdBy");
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Getting one Result

router.get("/:id", async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("quizId", "title createdBy");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
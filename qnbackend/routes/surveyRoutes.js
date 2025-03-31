import express from "express";
import mongoose from "mongoose";
import Survey from "../models/Survey.js";
import Result from "../models/Result.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Creating Quiz
router.post("/", async (req, res) => {
  try {
    const { title, password, description, createdBy, questions } = req.body;

    if (!title || !password || !createdBy) {
      return res.status(400).json({ message: "Title, password, and createdBy are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSurvey = new Survey({
      title,
      password: hashedPassword,
      description,
      createdBy,
      questions
    });

    await newSurvey.save();
    res.status(201).json({ message: "Survey created successfully", survey: newSurvey });
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ message: "Error creating survey", error: error.message });
  }
});

// Checking Password
router.post("/check-password", async (req, res) => {
  try {
    const { surveyId, password } = req.body;
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const isMatch = await bcrypt.compare(password, survey.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({ message: "Password correct" });
  } catch (error) {
    res.status(500).json({ message: "Error checking password", error: error.message });
  }
});

// Getting Quizes
router.get("/", async (req, res) => {
  try {
    const surveys = await Survey.find({}, "-password");

    const resultsCount = await Result.aggregate([
      { $group: { _id: "$quizId", count: { $sum: 1 } } }
    ]);

    const surveysWithCounts = surveys.map(survey => {
      const result = resultsCount.find(r => r._id.toString() === survey._id.toString());
      return { ...survey.toObject(), timesPlayed: result ? result.count : 0 };
    });

    res.json(surveysWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching surveys", error: error.message });
  }
});


// Getting one Quiz 
router.get("/:id", async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Updating Quiz
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid survey ID" });
    }

    const { ...updateData } = req.body;
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    Object.assign(survey, updateData);
    await survey.save();

    res.json({ message: "Survey updated successfully", survey });
  } catch (error) {
    res.status(500).json({ message: "Error updating survey", error: error.message });
  }
});


// Deleting Quiz
router.delete("/:id", async (req, res) => {
  try {
    const { password } = req.body;
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, survey.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    await Survey.findByIdAndDelete(req.params.id);
    res.json({ message: "Survey deleted successfully" });
  } catch (error) {
    console.error("Error deleting survey:", error);
    res.status(500).json({ message: "Error deleting survey", error: error.message });
  }
});
export default router;

import express from "express";
import Survey from "../models/Survey.js";

const router = express.Router();

// Creating Quiz
router.post("/", async (req, res) => {
  try {
    const { title, password, description, createdBy, questions } = req.body;

    if (!title || !password || !createdBy) {
      return res.status(400).json({ message: "Title, password, and createdBy are required" });
    }

    const newSurvey = new Survey({
      title,
      password,
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

// Getting Quizes
router.get("/", async (req, res) => {
  try {
    const surveys = await Survey.find({}, "-password"); // Не віддаємо пароль
    res.json(surveys);
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
    const { password, ...updateData } = req.body;
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    if (survey.password !== password) {
      return res.status(403).json({ message: "Incorrect password" });
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

    if (survey.password !== password) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    await survey.deleteOne();
    res.json({ message: "Survey deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting survey", error: error.message });
  }
});

export default router;

import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "single_choice", "multiple_choice"],
    required: true,
  },
  questionText: { type: String, required: true },
  answers: [{ type: String }], 
  correctAnswers: { type: mongoose.Schema.Types.Mixed },
});

const SurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String },
  createdBy: { type: String, required: true },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
});

const Survey = mongoose.model("Survey", SurveySchema);

export default Survey;

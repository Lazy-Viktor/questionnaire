import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import surveyRoutes from "./routes/surveyRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: [ "Content-Type" ]
}));

app.use(express.json());

async function connectDB() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    }
}
  
connectDB();

app.use("/api/surveys", surveyRoutes);
app.use("/api/results", resultRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

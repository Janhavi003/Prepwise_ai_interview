import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// AI evaluation route
app.post("/api/evaluate", async (req, res) => {
  const { answer, question } = req.body;

  console.log("Incoming request:", { question, answer });

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
  {
    role: "system",
    content: `You are an expert interview evaluator.

Return response ONLY in this JSON format:

{
  "score": number (out of 10),
  "strengths": [array of points],
  "weaknesses": [array of points],
  "improvements": [array of points]
}`
  },
  {
    role: "user",
    content: `Question: ${question}\nAnswer: ${answer}`
  }
]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("AI response:", response.data);

    const raw = response.data.choices[0].message.content;

let parsed;

try {
  parsed = JSON.parse(raw);
} catch (err) {
  parsed = {
    score: 0,
    strengths: [],
    weaknesses: [],
    improvements: ["Failed to parse AI response"]
  };
}

res.json(parsed);

    // res.json({ feedback });

  } catch (error) {
    console.error("ERROR DETAILS:");
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "AI evaluation failed",
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
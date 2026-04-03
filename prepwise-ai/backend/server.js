import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// ✅ Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ✅ AI Evaluation Route
app.post("/api/evaluate", async (req, res) => {
  const { question, answer } = req.body;

  console.log("Incoming request:", { question, answer });

  try {
    // 🔥 Call Groq API
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
  "weakness": [array of points],
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

    // ✅ Extract AI response
    const raw = response.data.choices[0].message.content;

    console.log("AI raw response:", raw);

    // ✅ Parse JSON safely
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("JSON parse failed");

      parsed = {
        score: 0,
        strengths: [],
        weakness: [],
        improvements: ["Failed to parse AI response"]
      };
    }

    // ✅ Save to Supabase
    const { error } = await supabase.from("interviews").insert([
      {
        question,
        answer,
        score: parsed.score,
        strengths: parsed.strengths,
        weakness: parsed.weakness,
        improvements: parsed.improvements
      }
    ]);

    if (error) {
      console.error("Supabase error:", error);
    }

    // ✅ Send response to frontend
    res.json(parsed);

  } catch (error) {
    console.error("ERROR DETAILS:");
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "AI evaluation failed"
    });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
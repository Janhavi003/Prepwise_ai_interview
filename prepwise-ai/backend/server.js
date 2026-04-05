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

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ===============================
// CLEAN JSON FIX FUNCTION
// ===============================
const cleanJSON = (text) => {
  return text.replace(/```json|```/g, "").trim();
};

// ===============================
// GENERATE QUESTIONS
// ===============================
app.post("/api/generate-questions", async (req, res) => {
  const { role, level } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Generate 8-10 interview questions.

Return ONLY JSON:

{
  "questions": ["q1", "q2", "q3"]
}`
          },
          {
            role: "user",
            content: `Role: ${role}, Level: ${level}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    let raw = response.data.choices[0].message.content;

    console.log("RAW:", raw);

    raw = cleanJSON(raw);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        questions: [
          "Explain REST vs GraphQL",
          "What is closure in JS?"
        ]
      };
    }

    res.json(parsed);

  } catch (err) {
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// ===============================
// EVALUATION
// ===============================
app.post("/api/evaluate", async (req, res) => {
  const { question, answer } = req.body;
  const userId = req.headers["x-user-id"] || null;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Return ONLY JSON:

{
  "score": number,
  "strengths": [],
  "weakness": [],
  "improvements": []
}`
          },
          {
            role: "user",
            content: `Q: ${question}\nA: ${answer}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    let raw = response.data.choices[0].message.content;
    raw = cleanJSON(raw);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        score: 0,
        strengths: [],
        weakness: [],
        improvements: []
      };
    }

    const weakness = parsed.weakness || parsed.weakness || [];

    // SAVE ONLY IF COLUMN EXISTS
    await supabase.from("interviews").insert([
      {
        user_id: userId || "anonymous",
        question,
        answer,
        score: parsed.score,
        strengths: parsed.strengths,
        weakness,
        improvements: parsed.improvements,
        created_at: new Date()
      }
    ]);

    res.json({
      score: parsed.score,
      strengths: parsed.strengths,
      weakness,
      improvements: parsed.improvements
    });

  } catch (err) {
    res.status(500).json({ error: "Evaluation failed" });
  }
});

// ===============================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
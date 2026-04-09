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
  const userId = req.headers["x-user-id"] || "anonymous";

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an interview evaluator.

Return ONLY valid JSON (no markdown, no text):

{
  "score": number (0-10),
  "strengths": ["point"],
  "weaknesses": ["point"],
  "improvements": ["point"]
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
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    let raw = response.data.choices[0].message.content;

    // 🔥 CLEAN AI RESPONSE
    raw = raw.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Parse failed:", raw);

      parsed = {};
    }

    // ✅ FORCE SAFE STRUCTURE
    const safeResponse = {
      score: parsed.score ?? 0,
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? parsed.weakness ?? [],
      improvements: parsed.improvements ?? []
    };

    // SAVE
    await supabase.from("interviews").insert([
      {
        user_id: userId,
        question,
        answer,
        score: safeResponse.score,
        strengths: safeResponse.strengths,
        weaknesses: safeResponse.weaknesses,
        improvements: safeResponse.improvements,
        created_at: new Date()
      }
    ]);

    res.json(safeResponse);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      score: 0,
      strengths: [],
      weaknesses: [],
      improvements: ["Evaluation failed"]
    });
  }
});

// ===============================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
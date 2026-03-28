import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API running 🚀");
});
// 🚀 Convert API
app.post("/convert", async (req, res) => {
  const { message, tone } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const prompt = `
You are an expert corporate communication assistant.

Convert the following message into polished corporate communication.

Guidelines:
- Maintain original intent
- Remove aggression/slang
- Keep it concise
- Do not over-apologize
- Do not change meaning

Tone: ${tone}

Output rules:
- Only return final message
- No explanation

Message:
"${message}"
`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    // ❗ Proper error handling
    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI Error:", errText);
      return res.status(500).json({ error: "AI request failed" });
    }

    const data = await response.json();

    console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ FINAL PARSING (stable)
    let output = "";

    try {
      output = data.output[0].content[0].text;
    } catch (e) {
      console.error("Parsing error:", e);
      output = "Error getting response";
    }

    res.json({ result: output });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 🚀 Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
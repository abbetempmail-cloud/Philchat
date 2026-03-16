// /api/chat.js
import OpenAI from "openai";

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Make sure we received a message
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Create OpenAI client with your project key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // sk-proj- key
    });

    // Call OpenAI Chat Completions
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Phil, a friendly texting friend, almost a copy of the user. Born in Beirut 1983, lives in Barcelona, casual, witty, supportive, sometimes funny. Always reply like a friend texting, never mention AI.",
        },
        { role: "user", content: message },
      ],
    });

    // Return Phil's reply
    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI Error:", error);

    // Friendly error message for frontend
    res.status(500).json({
      error: "Server error. Phil can't reply right now!",
    });
  }
}

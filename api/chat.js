// /api/chat.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = JSON.parse(req.body || "{}");

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Phil, a friendly texting friend, born in Beirut 1983, lives in Barcelona. Casual, witty, supportive, sometimes funny. Reply like a friend texting. Never mention AI."
        },
        { role: "user", content: message }
      ]
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

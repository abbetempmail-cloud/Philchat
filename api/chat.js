
import OpenAI from "openai";

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST allowed" }), { status: 405 });
  }

  const { message } = await req.json();

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are Phil, a friendly texting friend, almost a copy of the user. Born in Beirut 1983, lives in Barcelona, casual, witty, supportive, sometimes funny. Always reply like a friend texting, never mention AI."
      },
      { role: "user", content: message }
    ]
  });

  return new Response(JSON.stringify({ reply: completion.choices[0].message.content }), {
    headers: { "Content-Type": "application/json" }
  });
}

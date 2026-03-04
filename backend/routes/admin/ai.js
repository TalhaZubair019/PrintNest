const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey)
      return res.status(500).json({ error: "GROQ_API_KEY is not configured." });

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are an expert SEO e-commerce copywriter. Your goal is to write descriptions that rank high on Google while converting readers into buyers.",
            },
            {
              role: "user",
              content: `Write a highly SEO-optimized, compelling product description (2-3 sentences) for a print-on-demand product titled: "${title}"${category ? ` in the category: "${category}"` : ""}. 
            Instructions:
              1. Identify 2-3 high-traffic SEO keywords naturally related to this title/category.
              2. Seamlessly integrate these keywords into the description.
              3. Focus on search intent, product quality, appeal, and key benefits. 
              4. Do not use bullet points. 
              5. Return ONLY the description text, nothing else.`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message ?? "Failed to generate description.";
      return res.status(response.status).json({ error: message });
    }

    const description = data?.choices?.[0]?.message?.content?.trim();
    if (!description)
      return res.status(500).json({ error: "No description returned." });
    return res.json({ description });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate description." });
  }
});

module.exports = router;

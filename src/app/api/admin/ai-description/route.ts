import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `Write a short, compelling product description (2-3 sentences) for an e-commerce product titled: "${title}". Focus on quality, appeal, and key benefits. Do not use bullet points. Return only the description text.`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      const message = data?.error?.message ?? "Failed to generate description.";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const description = data?.choices?.[0]?.message?.content?.trim();

    if (!description) {
      return NextResponse.json({ error: "No description returned." }, { status: 500 });
    }

    return NextResponse.json({ description });
  } catch (error: any) {
    console.error("AI description error:", error?.message ?? error);
    return NextResponse.json({ error: "Failed to generate description." }, { status: 500 });
  }
}
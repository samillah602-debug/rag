import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing on the server." },
        { status: 500 }
      );
    }

    // Create the client INSIDE the request handler.
    // This prevents Vercel's build process from crashing
    // while evaluating the module.
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const body = await request.json();

    const messages: ChatMessage[] = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (message: ChatMessage) =>
              message &&
              (message.role === "user" || message.role === "assistant") &&
              typeof message.content === "string" &&
              message.content.trim()
          )
          .map((message: ChatMessage) => ({
            role: message.role,
            content: message.content,
          }))
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Please send a message." },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
    });

    const text =
      completion.choices[0]?.message?.content ||
      "No response was returned.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Groq API error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing from .env.local" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const messages: ChatMessage[] = Array.isArray(body.messages)
      ? body.messages
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No messages were provided." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "openai/gpt-oss-120b",
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    return NextResponse.json({
      text: response.output_text || "No response returned.",
    });
  } catch (error) {
    console.error("Groq API error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown Groq API error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
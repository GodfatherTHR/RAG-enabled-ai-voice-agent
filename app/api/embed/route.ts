import { genAI } from "@/lib/gemini";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return Response.json(
        { error: "Invalid request: text is required" },
        { status: 400 }
      );
    }

    // Generate embedding using Gemini's text-embedding-004 model
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    return Response.json({ embedding });
  } catch (error) {
    console.error("Error generating embedding:", error);
    return Response.json(
      { error: "Failed to generate embedding" },
      { status: 500 }
    );
  }
}

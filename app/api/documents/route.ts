import { addDocument } from "@/lib/rag";
import { NextRequest } from "next/server";

/**
 * API route to add new documents to the knowledge base
 */
export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return Response.json(
        { error: "Invalid request: title and content are required" },
        { status: 400 }
      );
    }

    const success = await addDocument(title, content);

    if (!success) {
      return Response.json(
        { error: "Failed to add document - check server logs for details" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, message: "Document added successfully" });
  } catch (error) {
    console.error("Error in documents API (full error):", error);
    return Response.json(
      { error: "Failed to add document", details: String(error) },
      { status: 500 }
    );
  }
}

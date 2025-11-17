import { genAI } from "@/lib/gemini";
import { searchDocs } from "@/lib/rag";
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

    // Search for relevant documents using RAG
    const contextDocs = await searchDocs(text, 3);
    console.log("🔍 Search query:", text);
    console.log("📚 Found documents:", contextDocs?.length || 0);
    console.log("📄 Documents:", contextDocs);
    
    const context = contextDocs?.map((d) => d.content).join("\n\n") ?? "";
    console.log("📝 Context length:", context.length);

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an AI customer service agent for a company.

${context ? `You MUST use the following information to answer the user's question. Do NOT make up information.\n\nCOMPANY INFORMATION:\n${context}\n\n` : ""}User Question: ${text}

AI Response: Provide a natural, conversational response using the company information above. Use plain text without any markdown formatting (no asterisks, no bullet points, no special characters). Write in complete sentences as if speaking to the customer.`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return Response.json({ reply });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    console.error("Error details:", {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      errorDetails: error?.errorDetails
    });
    return Response.json(
      { 
        error: "Failed to generate response",
        details: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}

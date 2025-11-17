import { searchDocs } from "@/lib/rag";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query, matchCount = 3 } = await req.json();

    if (!query || typeof query !== "string") {
      return Response.json(
        { error: "Invalid request: query is required" },
        { status: 400 }
      );
    }

    const results = await searchDocs(query, matchCount);

    return Response.json({ results });
  } catch (error) {
    console.error("Error in search API:", error);
    return Response.json(
      { error: "Failed to search documents" },
      { status: 500 }
    );
  }
}

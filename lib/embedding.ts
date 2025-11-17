/**
 * Generate embedding using Gemini API
 * This is a client-side utility that calls the embed API route
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch("/api/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  return data.embedding;
}

/**
 * Server-side embedding generation (for API routes)
 */
import { genAI } from "./gemini";

export async function generateEmbeddingServer(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

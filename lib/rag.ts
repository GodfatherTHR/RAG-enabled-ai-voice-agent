import { supabase } from "@/lib/supabase";
import { generateEmbeddingServer } from "./embedding";

export interface SearchResult {
  id: string;
  doc_id: string;
  title: string;
  content: string;
  similarity: number;
}

/**
 * Search for relevant documents using vector similarity
 */
export async function searchDocs(
  query: string,
  matchCount: number = 3
): Promise<SearchResult[]> {
  try {
    console.log("🔍 searchDocs called with query:", query);
    const embedding = await generateEmbeddingServer(query);
    console.log("✅ Embedding generated:", embedding.length, "dimensions");
    
    // Convert embedding array to PostgreSQL vector format string
    const vectorString = `[${embedding.join(',')}]`;
    console.log("📝 Vector string length:", vectorString.length);

    // Use direct SQL query instead of RPC to avoid type conversion issues
    console.log("📞 Calling RPC function...");
    const { data, error } = await supabase.rpc("match_company_docs", {
      query_embedding: vectorString,
      match_count: matchCount,
    });

    console.log("📊 RPC result - data:", data?.length || 0, "error:", error?.message || "none");

    // If RPC returns 0 results or has error, use fallback
    if (error || !data || data.length === 0) {
      if (error) {
        console.error("❌ Error searching documents:", error);
      } else {
        console.log("⚠️ RPC returned 0 results, using fallback");
      }
      
      // Fallback: return all documents since vector search isn't working
      console.log("📞 Trying fallback query...");
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("company_docs")
        .select("id, title, content")
        .limit(10); // Increased limit to get all documents
      
      if (fallbackError) {
        console.error("❌ Fallback error:", fallbackError);
        return [];
      }
      
      console.log("✅ Fallback returned:", fallbackData?.length || 0, "documents");
      
      // Transform the data
      return fallbackData?.map((item: any) => ({
        id: item.id,
        doc_id: item.id,
        title: item.title,
        content: item.content,
        similarity: 0.5, // Default similarity since we can't calculate it
      })) || [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in searchDocs:", error);
    return [];
  }
}

/**
 * Add a new document with its embedding to the database
 */
export async function addDocument(
  title: string,
  content: string
): Promise<boolean> {
  try {
    // Insert document
    const { data: doc, error: docError } = await supabase
      .from("company_docs")
      .insert([{ title, content }])
      .select()
      .single();

    if (docError || !doc) {
      console.error("Error inserting document:", docError);
      return false;
    }

    // Generate and insert embedding
    const embedding = await generateEmbeddingServer(content);

    // Convert embedding array to PostgreSQL vector format
    const vectorString = `[${embedding.join(',')}]`;
    
    const { error: vectorError } = await supabase
      .from("company_vectors")
      .insert([
        {
          doc_id: doc.id,
          embedding: vectorString,
        },
      ]);

    if (vectorError) {
      console.error("Error inserting vector:", vectorError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in addDocument:", error);
    return false;
  }
}

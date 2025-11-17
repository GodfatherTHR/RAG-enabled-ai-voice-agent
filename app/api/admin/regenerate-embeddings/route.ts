import { supabase } from "@/lib/supabase";
import { generateEmbeddingServer } from "@/lib/embedding";
import { NextRequest } from "next/server";

/**
 * Regenerate embeddings for all documents
 */
export async function POST(req: NextRequest) {
  try {
    console.log("🔄 Starting embedding regeneration...");

    // 1. Delete all existing vectors
    const { error: deleteError } = await supabase
      .from("company_vectors")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

    if (deleteError) {
      console.error("Error deleting vectors:", deleteError);
      return Response.json(
        { error: "Failed to delete old vectors" },
        { status: 500 }
      );
    }

    console.log("✅ Old vectors deleted");

    // 2. Get all documents
    const { data: docs, error: docsError } = await supabase
      .from("company_docs")
      .select("*");

    if (docsError || !docs) {
      console.error("Error fetching documents:", docsError);
      return Response.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      );
    }

    console.log(`📚 Found ${docs.length} documents`);

    // 3. Generate and insert embeddings
    let successCount = 0;
    let errorCount = 0;

    for (const doc of docs) {
      try {
        console.log(`📄 Processing: ${doc.title}`);

        // Generate embedding
        const embedding = await generateEmbeddingServer(doc.content);

        // Convert to PostgreSQL vector format
        const vectorString = `[${embedding.join(",")}]`;

        // Insert into database
        const { error: insertError } = await supabase
          .from("company_vectors")
          .insert({
            doc_id: doc.id,
            embedding: vectorString,
          });

        if (insertError) {
          console.error(`❌ Error inserting ${doc.title}:`, insertError);
          errorCount++;
        } else {
          console.log(`✅ Successfully processed ${doc.title}`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${doc.title}:`, error);
        errorCount++;
      }
    }

    console.log(`✨ Done! Success: ${successCount}, Errors: ${errorCount}`);

    return Response.json({
      success: true,
      message: `Regenerated embeddings for ${successCount} documents. ${errorCount} errors.`,
      successCount,
      errorCount,
    });
  } catch (error) {
    console.error("Error in regenerate embeddings:", error);
    return Response.json(
      { error: "Failed to regenerate embeddings" },
      { status: 500 }
    );
  }
}

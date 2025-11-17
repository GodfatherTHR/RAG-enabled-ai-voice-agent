const { createClient } = require("@supabase/supabase-js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function fixVectors() {
  console.log("🔧 Fixing vectors...\n");
  
  // 1. Delete all existing vectors
  console.log("1️⃣ Deleting old vectors...");
  const { error: deleteError } = await supabase
    .from("company_vectors")
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  if (deleteError) {
    console.error("Error deleting:", deleteError);
    return;
  }
  console.log("✅ Old vectors deleted\n");
  
  // 2. Get all documents
  console.log("2️⃣ Getting documents...");
  const { data: docs, error: docsError } = await supabase
    .from("company_docs")
    .select("*");
  
  if (docsError || !docs) {
    console.error("Error getting docs:", docsError);
    return;
  }
  console.log(`✅ Found ${docs.length} documents\n`);
  
  // 3. Generate and insert embeddings
  console.log("3️⃣ Generating embeddings...");
  const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
  
  for (const doc of docs) {
    console.log(`\n📄 Processing: ${doc.title}`);
    
    try {
      // Generate embedding
      const result = await embedModel.embedContent(doc.content);
      const embedding = result.embedding.values;
      
      console.log(`  📊 Embedding dimensions: ${embedding.length}`);
      
      // Convert to PostgreSQL vector format
      const vectorString = `[${embedding.join(',')}]`;
      
      // Insert into database
      const { error: insertError } = await supabase
        .from("company_vectors")
        .insert({
          doc_id: doc.id,
          embedding: vectorString
        });
      
      if (insertError) {
        console.error(`  ❌ Error inserting:`, insertError);
      } else {
        console.log(`  ✅ Successfully inserted`);
      }
    } catch (error) {
      console.error(`  ❌ Error:`, error.message);
    }
  }
  
  console.log("\n✨ Done!");
}

fixVectors();

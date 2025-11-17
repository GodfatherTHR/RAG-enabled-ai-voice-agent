const { createClient } = require("@supabase/supabase-js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testDirectQuery() {
  console.log("🔍 Testing direct SQL query...\n");
  
  const query = "pricing plans";
  
  try {
    // Generate embedding
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(query);
    const embedding = result.embedding.values;
    
    console.log("✅ Query embedding:", embedding.length, "dimensions");
    console.log("First 5 values:", embedding.slice(0, 5), "\n");
    
    // Try direct SQL query with proper casting
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          cv.id,
          cd.title,
          cd.content,
          cv.embedding::text as embedding_str,
          length(cv.embedding::text) as embedding_length
        FROM company_vectors cv
        JOIN company_docs cd ON cv.doc_id = cd.id
        LIMIT 3
      `
    });
    
    if (error) {
      console.log("Direct SQL not available, trying simple select...\n");
      
      // Just get the vectors
      const { data: vectors, error: vecError } = await supabase
        .from("company_vectors")
        .select("id, doc_id, embedding");
      
      if (vecError) {
        console.error("❌ Error:", vecError);
      } else {
        console.log("✅ Found vectors:", vectors?.length);
        if (vectors && vectors.length > 0) {
          const vec = vectors[0];
          console.log("\nFirst vector:");
          console.log("  ID:", vec.id);
          console.log("  Doc ID:", vec.doc_id);
          console.log("  Embedding type:", typeof vec.embedding);
          console.log("  Embedding:", JSON.stringify(vec.embedding).substring(0, 200));
        }
      }
    } else {
      console.log("✅ Results:", data);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testDirectQuery();

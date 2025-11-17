const { createClient } = require("@supabase/supabase-js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testSearch() {
  console.log("🔍 Testing vector search...\n");
  
  const query = "What are your pricing plans?";
  console.log("Query:", query);
  
  try {
    // Generate embedding for query
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(query);
    const embedding = result.embedding.values;
    
    console.log("✅ Query embedding generated:", embedding.length, "dimensions\n");
    
    // Convert to vector string format
    const vectorString = `[${embedding.join(',')}]`;
    console.log("Vector string (first 100 chars):", vectorString.substring(0, 100));
    
    // Try the RPC function
    console.log("\nCalling match_company_docs...");
    const { data, error } = await supabase.rpc("match_company_docs", {
      query_embedding: vectorString,
      match_count: 3,
    });
    
    if (error) {
      console.error("❌ RPC Error:", error);
    } else {
      console.log("✅ Search results:", data?.length || 0);
      if (data) {
        data.forEach(doc => {
          console.log(`\n📄 ${doc.title}`);
          console.log(`   Similarity: ${doc.similarity}`);
          console.log(`   Content: ${doc.content.substring(0, 100)}...`);
        });
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testSearch();

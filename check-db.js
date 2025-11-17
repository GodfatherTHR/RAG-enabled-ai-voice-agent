const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabase() {
  console.log("Checking database...\n");
  
  // Check documents
  const { data: docs, error: docsError } = await supabase
    .from("company_docs")
    .select("*");
  
  console.log("📄 Documents in company_docs:", docs?.length || 0);
  if (docs) {
    docs.forEach(doc => {
      console.log(`  - ${doc.title} (ID: ${doc.id})`);
    });
  }
  if (docsError) console.error("Error:", docsError);
  
  // Check vectors
  const { data: vectors, error: vectorsError } = await supabase
    .from("company_vectors")
    .select("*");
  
  console.log("\n🧠 Vectors in company_vectors:", vectors?.length || 0);
  if (vectors) {
    vectors.forEach(vec => {
      console.log(`  - Doc ID: ${vec.doc_id}, Embedding dims: ${vec.embedding?.length || 0}`);
    });
  }
  if (vectorsError) console.error("Error:", vectorsError);
}

checkDatabase();

const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testEmbedding() {
  console.log("Testing embedding generation...\n");
  
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent("Test content");
    const embedding = result.embedding.values;
    
    console.log("✅ Embedding generated successfully!");
    console.log("📊 Dimensions:", embedding.length);
    console.log("📝 First 5 values:", embedding.slice(0, 5));
    console.log("📝 Type:", typeof embedding);
    console.log("📝 Is Array:", Array.isArray(embedding));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testEmbedding();

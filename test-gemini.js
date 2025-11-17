const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  console.log("Testing Gemini API...");
  console.log("API Key:", process.env.GEMINI_API_KEY ? "Found" : "Missing");
  
  try {
    // Try different model names
    const modelNames = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro"
    ];
    
    for (const modelName of modelNames) {
      try {
        console.log(`\nTrying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ Success with ${modelName}! Response:`, text);
        return;
      } catch (err) {
        console.log(`❌ Failed with ${modelName}:`, err.message);
      }
    }
    
    throw new Error("All model names failed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Status:", error.status);
    console.error("Details:", error);
  }
}

testGemini();

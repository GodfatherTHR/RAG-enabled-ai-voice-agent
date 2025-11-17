const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  console.log("Listing available Gemini models...\n");
  console.log("API Key:", process.env.GEMINI_API_KEY);
  
  try {
    // Try to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
    }
    
    const data = await response.json();
    console.log("\n✅ Available models:");
    data.models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Supports: ${model.supportedGenerationMethods.join(', ')}`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

listModels();

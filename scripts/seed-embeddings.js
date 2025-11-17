/**
 * Script to seed embeddings for existing documents
 * Run this after setting up the database schema
 * 
 * Usage: node scripts/seed-embeddings.js
 */

const documents = [
  {
    title: "Company Overview",
    content: "We are a leading AI solutions provider specializing in voice assistants and customer service automation. Founded in 2020, we serve over 500 enterprise clients worldwide."
  },
  {
    title: "Product Features",
    content: "Our AI voice agent supports 50+ languages, real-time transcription, sentiment analysis, and seamless CRM integration. It handles 10,000+ concurrent calls with 99.9% uptime."
  },
  {
    title: "Pricing Plans",
    content: "Starter plan: $99/month for 1,000 minutes. Professional: $499/month for 10,000 minutes. Enterprise: Custom pricing with dedicated support and unlimited minutes."
  }
];

async function seedEmbeddings() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  
  console.log("🌱 Starting to seed embeddings...\n");

  for (const doc of documents) {
    try {
      console.log(`📄 Processing: ${doc.title}`);
      
      const response = await fetch(`${baseUrl}/api/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doc),
      });

      if (response.ok) {
        console.log(`✅ Successfully added: ${doc.title}\n`);
      } else {
        const error = await response.json();
        console.error(`❌ Failed to add ${doc.title}:`, error, "\n");
      }
    } catch (error) {
      console.error(`❌ Error processing ${doc.title}:`, error, "\n");
    }
  }

  console.log("✨ Seeding complete!");
}

seedEmbeddings();

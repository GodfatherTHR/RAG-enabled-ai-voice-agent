# 🤖 AI Voice Assistant with RAG

A production-ready AI voice assistant built with Next.js, Gemini AI, and Supabase vector search. Features real-time voice interaction, intelligent chat, and RAG (Retrieval-Augmented Generation) for context-aware responses.

## ✨ Features

✅ **Next.js 15 (App Router)** - Modern React framework with server components  
✅ **Gemini AI API** - Powerful language model and embeddings  
✅ **Supabase** - PostgreSQL database with pgvector extension  
✅ **Voice Input** - Browser-based speech recognition  
✅ **Text-to-Speech** - Natural voice responses  
✅ **RAG System** - Vector similarity search for contextual answers  
✅ **Modern UI** - Beautiful, responsive design with Tailwind CSS  
✅ **100% Free Tier** - No backend server costs  

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                    # Main chat interface
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── api/
│   │   ├── chat/route.ts          # Chat endpoint with RAG
│   │   ├── embed/route.ts         # Embedding generation
│   │   ├── search/route.ts        # Vector search
│   │   └── documents/route.ts     # Document management
│   └── components/
│       ├── MicButton.tsx          # Voice input component
│       ├── ChatMessage.tsx        # Chat bubble UI
│       └── LoadingDots.tsx        # Loading indicator
│
├── lib/
│   ├── gemini.ts                  # Gemini AI client
│   ├── supabase.ts                # Supabase client
│   ├── rag.ts                     # RAG utilities
│   ├── embedding.ts               # Embedding helpers
│   └── speech.ts                  # Text-to-speech
│
├── supabase/
│   └── schema.sql                 # Database schema
│
├── .env.local                     # Environment variables
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory.

### 3. Set Up Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open the SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL script

This will:
- Enable the pgvector extension
- Create `company_docs` and `company_vectors` tables
- Set up vector similarity search function
- Insert sample documents

### 4. Generate Embeddings for Sample Data

After running the schema, you need to generate embeddings for the sample documents:

```bash
# Run the development server first
npm run dev

# Then use this script or call the API manually
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content"}'
```

Or use the provided script (create this file):

```javascript
// scripts/seed-embeddings.js
const documents = [
  {
    title: "Company Overview",
    content: "We are a leading AI solutions provider..."
  },
  // Add other documents
];

async function seedEmbeddings() {
  for (const doc of documents) {
    await fetch("http://localhost:3000/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });
  }
}

seedEmbeddings();
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Start Chatting!

- Click the microphone button to speak
- Or type your message in the text input
- The AI will respond with voice and text

## 🎯 How It Works

### Voice Recognition
- Uses browser's Web Speech API
- Supports real-time transcription
- Works in Chrome, Edge, and Safari

### RAG (Retrieval-Augmented Generation)
1. User sends a query
2. Query is converted to embedding using Gemini
3. Vector similarity search finds relevant documents
4. Documents are used as context for AI response
5. Gemini generates contextual answer

### Vector Search
- Uses pgvector extension in PostgreSQL
- Cosine similarity for semantic search
- Returns top 3 most relevant documents

## 📚 API Routes

### POST `/api/chat`
Generate AI response with RAG context

```json
{
  "text": "What are your pricing plans?"
}
```

Response:
```json
{
  "reply": "We offer three pricing plans..."
}
```

### POST `/api/embed`
Generate text embedding

```json
{
  "text": "Sample text to embed"
}
```

Response:
```json
{
  "embedding": [0.123, -0.456, ...]
}
```

### POST `/api/search`
Search documents by semantic similarity

```json
{
  "query": "pricing information",
  "matchCount": 3
}
```

Response:
```json
{
  "results": [
    {
      "id": 1,
      "title": "Pricing Plans",
      "content": "...",
      "similarity": 0.89
    }
  ]
}
```

### POST `/api/documents`
Add new document to knowledge base

```json
{
  "title": "New Document",
  "content": "Document content..."
}
```

## 🔧 Configuration

### Gemini AI Models
- **Chat**: `gemini-1.5-flash` (fast, cost-effective)
- **Embeddings**: `text-embedding-004` (768 dimensions)

### Supabase
- **Database**: PostgreSQL with pgvector
- **Vector Dimensions**: 768
- **Similarity Metric**: Cosine similarity

## 🎨 Customization

### Change Voice Settings
Edit `lib/speech.ts`:

```typescript
export function speak(text: string, rate: number = 1.05): void {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;    // Speed (0.1 to 10)
  utterance.pitch = 1;      // Pitch (0 to 2)
  utterance.volume = 1;     // Volume (0 to 1)
  // ...
}
```

### Modify AI Personality
Edit `app/api/chat/route.ts`:

```typescript
const prompt = `You are a friendly and helpful AI assistant.
Your tone should be professional yet warm.
${context}
User: ${text}
AI:`;
```

### Add More Documents
Use the `/api/documents` endpoint or directly insert into Supabase:

```sql
INSERT INTO company_docs (title, content) VALUES
  ('New Topic', 'Content here...');
```

Then generate embeddings via the API.

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all API keys
- Supabase RLS (Row Level Security) recommended for production
- Rate limit API endpoints in production

## 📊 Free Tier Limits

### Gemini AI
- 15 requests per minute
- 1,500 requests per day
- Free forever

### Supabase
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- Free forever

## 🐛 Troubleshooting

### Voice recognition not working
- Use Chrome or Edge browser
- Allow microphone permissions
- Check HTTPS (required for Web Speech API)

### Embeddings not generating
- Verify Gemini API key is correct
- Check API quota limits
- Ensure model name is `text-embedding-004`

### Vector search returns no results
- Verify embeddings are inserted in database
- Check vector dimensions match (768)
- Run the seed script to populate data

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📧 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ using Next.js, Gemini AI, and Supabase

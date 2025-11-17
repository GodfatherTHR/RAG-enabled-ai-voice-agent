# 🚀 Complete Setup Guide

Follow these steps to get your AI Voice Assistant up and running.

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- Next.js 15
- React 19
- Gemini AI SDK
- Supabase Client
- Tailwind CSS

## Step 2: Configure Environment Variables

Your `.env.local` file is already configured with:
- ✅ Supabase URL
- ✅ Supabase Anon Key
- ✅ Gemini API Key

**Note**: These credentials are already set up for you!

## Step 3: Set Up Supabase Database

### 3.1 Access Supabase SQL Editor

1. Go to: https://app.supabase.com
2. Select your project: `rntqxrxhyabzjirajxje`
3. Click on "SQL Editor" in the left sidebar

### 3.2 Run the Schema

1. Open the file `supabase/schema.sql` in your project
2. Copy all the SQL code
3. Paste it into the Supabase SQL Editor
4. Click "Run" or press `Ctrl+Enter`

This will create:
- ✅ `company_docs` table (stores documents)
- ✅ `company_vectors` table (stores embeddings)
- ✅ Vector similarity search function
- ✅ Sample data (3 documents)

### 3.3 Verify Tables Created

In Supabase, go to "Table Editor" and verify you see:
- `company_docs` (with 3 rows)
- `company_vectors` (empty for now)

## Step 4: Generate Embeddings

The sample documents need embeddings for RAG to work.

### Option A: Using the Seed Script

```bash
# Start the dev server first
npm run dev

# In a new terminal, run:
node scripts/seed-embeddings.js
```

### Option B: Manual API Calls

```bash
# Start dev server
npm run dev

# In a new terminal, run these curl commands:
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Company Overview","content":"We are a leading AI solutions provider..."}'

curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Product Features","content":"Our AI voice agent supports 50+ languages..."}'

curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Pricing Plans","content":"Starter plan: $99/month..."}'
```

### Option C: Use Postman/Insomnia

1. Create a POST request to `http://localhost:3000/api/documents`
2. Set header: `Content-Type: application/json`
3. Body:
```json
{
  "title": "Document Title",
  "content": "Document content here..."
}
```

## Step 5: Start Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

## Step 6: Test the Application

### Test Voice Input
1. Open http://localhost:3000 in **Chrome or Edge** (Safari also works)
2. Click the microphone button 🎤
3. Allow microphone permissions when prompted
4. Speak: "What are your pricing plans?"
5. The AI should respond with voice and text

### Test Text Input
1. Type in the input box: "Tell me about your company"
2. Press Enter or click Send
3. The AI should respond with context from your knowledge base

### Test RAG (Retrieval-Augmented Generation)
Ask questions related to your sample documents:
- "What pricing plans do you offer?"
- "What features does your product have?"
- "Tell me about your company"

The AI should use the relevant documents to provide accurate answers.

## Step 7: Verify Everything Works

### Check Voice Recognition
- ✅ Microphone button appears
- ✅ Browser asks for mic permission
- ✅ Speech is transcribed correctly
- ✅ Transcription appears in the input

### Check AI Responses
- ✅ Messages appear in chat bubbles
- ✅ AI responds within 2-3 seconds
- ✅ Responses are contextual and relevant
- ✅ Text-to-speech plays automatically

### Check RAG System
- ✅ Questions about pricing return pricing info
- ✅ Questions about features return feature info
- ✅ Responses cite actual document content

## Troubleshooting

### Issue: Voice recognition not working
**Solution**: 
- Use Chrome or Edge browser
- Ensure you're on HTTPS or localhost
- Check microphone permissions in browser settings

### Issue: No AI response
**Solution**:
- Check browser console for errors (F12)
- Verify Gemini API key is correct
- Check API quota limits (15 req/min)

### Issue: RAG not working (generic responses)
**Solution**:
- Verify embeddings were generated (check `company_vectors` table)
- Run the seed script again
- Check Supabase connection

### Issue: "Failed to fetch" errors
**Solution**:
- Ensure dev server is running (`npm run dev`)
- Check `.env.local` file exists and has correct values
- Verify Supabase URL and keys are correct

## Next Steps

### Add More Documents
Use the API to add your own knowledge base:

```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Your Title","content":"Your content..."}'
```

### Customize the AI
Edit `app/api/chat/route.ts` to change the AI's personality:

```typescript
const prompt = `You are a [YOUR PERSONALITY HERE]...`;
```

### Deploy to Production
See README.md for deployment instructions to Vercel or Netlify.

## Support

If you encounter issues:
1. Check the console for errors (F12 in browser)
2. Review the README.md troubleshooting section
3. Verify all environment variables are set correctly

---

🎉 **Congratulations!** Your AI Voice Assistant is ready to use!

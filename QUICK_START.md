# ⚡ Quick Start Guide

## 🎉 Your AI Voice Assistant is Running!

The development server is now running at: **http://localhost:3000**

## 🚨 Important: Complete Setup Before Testing

### Step 1: Set Up Supabase Database (REQUIRED)

Your app won't work properly until you set up the database!

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Login with your account
   - Select project: `rntqxrxhyabzjirajxje`

2. **Run the SQL Schema**
   - Click "SQL Editor" in the left sidebar
   - Open the file: `supabase/schema.sql` in your project
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click "Run" or press `Ctrl+Enter`

3. **Verify Tables Created**
   - Go to "Table Editor" in Supabase
   - You should see:
     - ✅ `company_docs` (with 3 sample rows)
     - ✅ `company_vectors` (empty for now)

### Step 2: Generate Embeddings (REQUIRED)

The RAG system needs embeddings to work!

**Option A: Use the Seed Script (Recommended)**

Open a NEW terminal and run:

```bash
cd "F:/SAAS/Call_center AI agent"
node scripts/seed-embeddings.js
```

**Option B: Manual API Calls**

Use PowerShell or Command Prompt:

```powershell
# Test 1: Add Company Overview
Invoke-RestMethod -Uri "http://localhost:3000/api/documents" -Method POST -ContentType "application/json" -Body '{"title":"Company Overview","content":"We are a leading AI solutions provider specializing in voice assistants and customer service automation. Founded in 2020, we serve over 500 enterprise clients worldwide."}'

# Test 2: Add Product Features
Invoke-RestMethod -Uri "http://localhost:3000/api/documents" -Method POST -ContentType "application/json" -Body '{"title":"Product Features","content":"Our AI voice agent supports 50+ languages, real-time transcription, sentiment analysis, and seamless CRM integration. It handles 10,000+ concurrent calls with 99.9% uptime."}'

# Test 3: Add Pricing Plans
Invoke-RestMethod -Uri "http://localhost:3000/api/documents" -Method POST -ContentType "application/json" -Body '{"title":"Pricing Plans","content":"Starter plan: $99/month for 1,000 minutes. Professional: $499/month for 10,000 minutes. Enterprise: Custom pricing with dedicated support and unlimited minutes."}'
```

### Step 3: Test the Application

Now you're ready to test!

1. **Open in Browser**
   - Go to: http://localhost:3000
   - Use Chrome or Edge (recommended for voice)

2. **Test Voice Input**
   - Click the 🎤 microphone button
   - Allow microphone permissions
   - Say: "What are your pricing plans?"
   - The AI should respond with voice and text

3. **Test Text Input**
   - Type: "Tell me about your company"
   - Press Enter or click Send
   - The AI should respond with context from your knowledge base

4. **Test RAG System**
   - Ask: "What features does your product have?"
   - The AI should cite information from the documents
   - Responses should be specific and contextual

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Supabase schema has been executed
- [ ] `company_docs` table has 3 rows
- [ ] `company_vectors` table has 3 rows (after running seed script)
- [ ] Development server is running (http://localhost:3000)
- [ ] Using Chrome or Edge browser
- [ ] Microphone permissions granted
- [ ] No console errors (press F12 to check)

## 🎯 Test Queries

Try these questions to test the RAG system:

**About Company:**
- "Tell me about your company"
- "When was the company founded?"
- "How many clients do you have?"

**About Features:**
- "What features does your product have?"
- "How many languages do you support?"
- "What is your uptime?"

**About Pricing:**
- "What are your pricing plans?"
- "How much does the starter plan cost?"
- "What's included in the enterprise plan?"

## 🐛 Troubleshooting

### Voice Not Working
- ✅ Use Chrome or Edge browser
- ✅ Check microphone permissions
- ✅ Ensure you're on localhost (HTTPS not required)

### No AI Response
- ✅ Check browser console (F12) for errors
- ✅ Verify Gemini API key in `.env.local`
- ✅ Check if you've exceeded API quota (15 req/min)

### Generic Responses (RAG Not Working)
- ✅ Run the seed script to generate embeddings
- ✅ Verify `company_vectors` table has data
- ✅ Check Supabase connection

### "Failed to Fetch" Errors
- ✅ Ensure dev server is running
- ✅ Check `.env.local` file exists
- ✅ Verify Supabase URL and keys are correct

## 📁 Project Files

**Configuration:**
- `.env.local` - Environment variables (already configured)
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config

**Database:**
- `supabase/schema.sql` - Database schema (run this!)
- `scripts/seed-embeddings.js` - Seed script (run this!)

**Documentation:**
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `PROJECT_SUMMARY.md` - Technical overview
- `QUICK_START.md` - This file

## 🚀 Next Steps

1. **Complete the setup** (database + embeddings)
2. **Test the application** with sample queries
3. **Add your own documents** via API
4. **Customize the AI** personality in `app/api/chat/route.ts`
5. **Deploy to production** (see README.md)

## 📞 Need Help?

1. Check the browser console (F12) for errors
2. Review `SETUP_GUIDE.md` for detailed instructions
3. Verify all environment variables are set
4. Ensure Supabase tables are created

---

## 🎊 You're All Set!

Once you complete Steps 1 & 2 above, your AI Voice Assistant will be fully functional!

**Current Status:**
- ✅ Dependencies installed
- ✅ Development server running
- ⏳ Database setup (pending)
- ⏳ Embeddings generation (pending)

**Complete the pending steps to start using your AI assistant!**

-- ============================================
-- COMPLETE WORKING SUPABASE SETUP FOR RAG
-- ============================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Drop existing tables and recreate (clean slate)
DROP TABLE IF EXISTS company_vectors CASCADE;
DROP TABLE IF EXISTS company_docs CASCADE;

-- 3. Create company_docs table
CREATE TABLE company_docs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create company_vectors table with proper vector type
CREATE TABLE company_vectors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doc_id UUID REFERENCES company_docs(id) ON DELETE CASCADE,
  embedding VECTOR(768) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create index for fast vector similarity search
CREATE INDEX company_vectors_embedding_idx 
ON company_vectors USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 6. Disable RLS (Row Level Security) for testing
ALTER TABLE company_docs DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_vectors DISABLE ROW LEVEL SECURITY;

-- 7. Drop old function if exists
DROP FUNCTION IF EXISTS match_company_docs(vector, integer);
DROP FUNCTION IF EXISTS match_company_docs(text, integer);

-- 8. Create the vector search function
CREATE OR REPLACE FUNCTION match_company_docs(
  query_embedding VECTOR(768),
  match_count INT DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  doc_id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cv.id,
    cv.doc_id,
    cd.title,
    cd.content,
    1 - (cv.embedding <=> query_embedding) AS similarity
  FROM company_vectors cv
  JOIN company_docs cd ON cv.doc_id = cd.id
  ORDER BY cv.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 9. Insert sample documents
INSERT INTO company_docs (title, content) VALUES
  ('Company Overview', 'We are a leading AI solutions provider specializing in voice assistants and customer service automation. Founded in 2020, we serve over 500 enterprise clients worldwide.'),
  ('Product Features', 'Our AI voice agent supports 50+ languages, real-time transcription, sentiment analysis, and seamless CRM integration. It handles 10,000+ concurrent calls with 99.9% uptime.'),
  ('Pricing Plans', 'Starter plan: $99/month for 1,000 minutes. Professional: $499/month for 10,000 minutes. Enterprise: Custom pricing with dedicated support and unlimited minutes.')
ON CONFLICT DO NOTHING;

-- 10. Verify the setup
SELECT 
  'Documents' as table_name,
  COUNT(*) as row_count
FROM company_docs
UNION ALL
SELECT 
  'Vectors' as table_name,
  COUNT(*) as row_count
FROM company_vectors;

-- ============================================
-- TESTING QUERIES
-- ============================================

-- Test 1: Check if documents exist
SELECT id, title FROM company_docs;

-- Test 2: Check vector dimensions (after embeddings are inserted)
SELECT 
  cv.id,
  cd.title,
  vector_dims(cv.embedding) as dimensions
FROM company_vectors cv
JOIN company_docs cd ON cv.doc_id = cd.id;

-- Test 3: Test the search function with a dummy vector
-- (Replace with actual embedding from your app)
SELECT * FROM match_company_docs(
  ARRAY[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]::vector,
  3
);

-- ============================================
-- NOTES
-- ============================================
-- After running this SQL:
-- 1. Run: node fix-vectors.js (to generate and insert embeddings)
-- 2. Test the chat with: "What are your pricing plans?"
-- 3. The AI should now return specific pricing information

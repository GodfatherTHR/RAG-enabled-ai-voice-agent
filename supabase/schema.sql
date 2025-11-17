-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create company_docs table
CREATE TABLE IF NOT EXISTS company_docs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_vectors table with pgvector
CREATE TABLE IF NOT EXISTS company_vectors (
  id BIGSERIAL PRIMARY KEY,
  doc_id BIGINT REFERENCES company_docs(id) ON DELETE CASCADE,
  embedding VECTOR(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster vector similarity search
CREATE INDEX IF NOT EXISTS company_vectors_embedding_idx 
ON company_vectors USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_company_docs(
  query_embedding VECTOR(768),
  match_count INT DEFAULT 3
)
RETURNS TABLE (
  id BIGINT,
  doc_id BIGINT,
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

-- Insert sample data
INSERT INTO company_docs (title, content) VALUES
  ('Company Overview', 'We are a leading AI solutions provider specializing in voice assistants and customer service automation. Founded in 2020, we serve over 500 enterprise clients worldwide.'),
  ('Product Features', 'Our AI voice agent supports 50+ languages, real-time transcription, sentiment analysis, and seamless CRM integration. It handles 10,000+ concurrent calls with 99.9% uptime.'),
  ('Pricing Plans', 'Starter plan: $99/month for 1,000 minutes. Professional: $499/month for 10,000 minutes. Enterprise: Custom pricing with dedicated support and unlimited minutes.');

-- Note: You'll need to generate and insert embeddings separately using the /api/embed endpoint
-- Example: Call your embed API for each document, then insert the embedding into company_vectors

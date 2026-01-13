-- Vector similarity search function for RAG
-- Using 384 dimensions for HuggingFace embeddings
CREATE OR REPLACE FUNCTION match_market_documents(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  source text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    market_documents.id,
    market_documents.source,
    market_documents.content,
    1 - (market_documents.embedding <=> query_embedding) AS similarity
  FROM market_documents
  WHERE 1 - (market_documents.embedding <=> query_embedding) > match_threshold
  ORDER BY market_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

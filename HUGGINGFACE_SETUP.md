# 🎉 Hugging Face Embeddings Setup Guide

## Why HuggingFace?

**100% FREE** - No credit card required, unlimited usage with rate limits

## Quick Setup (2 minutes)

### Step 1: Create HuggingFace Account

1. Go to [huggingface.co](https://huggingface.co/join)
2. Sign up with email (free)
3. Verify your email

### Step 2: Get API Token

1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click **"New token"**
3. Name it: `verdict_ai_embeddings`
4. Token type: **Read**
5. Click **"Generate"**
6. Copy the token (starts with `hf_...`)

### Step 3: Add to Environment

In your `.env.local` file:

```bash
HUGGINGFACE_API_KEY=hf_your_token_here
```

That's it! ✨

## What Changed

- **Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Dimensions**: 384 (down from OpenAI's 1536)
- **Cost**: $0 forever
- **Performance**: Fast and accurate for startup idea analysis

## Technical Details

### Embedding Dimensions

The database now uses **384-dimensional vectors** instead of 1536:

```sql
embedding vector(384)  -- Updated in schema.sql
```

### API Endpoint

```
https://router.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2
```

### Rate Limits

- **Free tier**: ~1000 requests/hour
- **No daily cap**
- Automatic model loading (first request may be slow)

## Migration Steps (If You Already Have Data)

If you've already created the database with 1536 dimensions:

1. **Drop the old table**:
   ```sql
   DROP TABLE market_documents;
   ```

2. **Re-run the schema**:
   - Run `supabase/schema.sql` again
   - It will create the table with 384 dimensions

3. **Update the function**:
   - Run `supabase/functions.sql` again

## Testing Your Setup

Run this to verify embeddings work:

```bash
# In your Next.js app
npm run dev

# Submit a test idea through the UI
# Check the console for HuggingFace API calls
```

## Troubleshooting

### "Model is loading..."

**Solution**: Wait 10-20 seconds and try again. The model auto-loads on first request.

### "401 Unauthorized"

**Solution**: Check that your token is correct and has "Read" access.

### "Rate limited"

**Solution**: You're making too many requests. Wait a minute and try again.

## Model Comparison

| Provider | Model | Dimensions | Cost | Quality |
|----------|-------|------------|------|---------|
| **HuggingFace** | all-MiniLM-L6-v2 | 384 | FREE | ⭐⭐⭐⭐ |
| OpenAI | text-embedding-3-small | 1536 | $0.02/1M | ⭐⭐⭐⭐⭐ |
| Cohere | embed-light | 1024 | $0.10/1M | ⭐⭐⭐⭐ |

For startup idea analysis, the free HuggingFace model is **more than sufficient**.

## Alternative Models (Advanced)

You can switch to other HuggingFace models by changing the URL in `lib/groq.ts`:

```typescript
const HF_API_URL = 'https://router.huggingface.co/pipeline/feature-extraction/MODEL_NAME';
```

Popular alternatives:
- `sentence-transformers/all-mpnet-base-v2` (768 dims, best quality)
- `BAAI/bge-small-en-v1.5` (384 dims, multilingual)

**Note**: Update the vector dimensions in the database schema to match!

---

**You're all set! Enjoy free, unlimited embeddings! 🚀**

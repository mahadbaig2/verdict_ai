# Verdict.ai - Startup Idea Decision Engine

A production-ready SaaS MVP that gives founders a brutally honest **Go / Pivot / Kill** verdict on their startup ideas using real market signals and AI analysis.

## 🎯 Features

- **Clear Verdicts**: Get an unambiguous Go, Pivot, or Kill decision
- **Market-Driven**: Analysis powered by Reddit discussions, competitor data, and pricing intelligence
- **RAG Pipeline**: Retrieval-Augmented Generation for context-aware AI decisions
- **Credit System**: Free tier with 3 credits, no payment gateway required
- **Structured Output**: Reasoning, risks, success conditions, and next steps

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 (App Router, TypeScript)
- **Backend**: Supabase (Auth, Postgres, Vector Storage)
- **AI**: Groq API with Kimi K2 Instruct model
- **Embeddings**: HuggingFace Inference API (sentence-transformers/all-MiniLM-L6-v2) - **FREE!**
- **Styling**: Tailwind CSS

## 📁 Project Structure

```
verdict_ai/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/
│   │   └── page.tsx                # Authentication
│   ├── dashboard/
│   │   ├── page.tsx                # Idea history
│   │   ├── new/
│   │   │   └── page.tsx            # New idea form
│   │   └── idea/
│   │       └── [id]/
│   │           └── page.tsx        # Verdict display
│   └── api/
│       └── analyze/
│           └── route.ts            # Main orchestration endpoint
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── auth.ts                     # Auth utilities
│   ├── groq.ts                     # Groq API wrapper
│   ├── rag.ts                      # RAG pipeline
│   └── database.types.ts           # TypeScript types
└── supabase/
    ├── schema.sql                  # Database schema
    └── functions.sql               # Vector search function
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Groq API key
- HuggingFace account (free - for embeddings)

### 1. Clone and Install

```bash
cd verdict_ai
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema:
   - Go to SQL Editor in Supabase Dashboard
   - Copy and execute `supabase/schema.sql`
   - Copy and execute `supabase/functions.sql`
3. Enable the `vector` extension:
   - Go to Database → Extensions
   - Enable `vector`

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from example
cp env.example .env.local
```

Fill in your credentials:

```env
# Supabase (from Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key

# Groq API (from console.groq.com)
GROQ_API_KEY=your_groq_api_key

# HuggingFace API (from huggingface.co/settings/tokens) - FREE!
HUGGINGFACE_API_KEY=your_huggingface_token
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 API Keys Setup

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to Project Settings → API
4. Copy the Project URL, publishable key, and secret key

### Groq
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up and create an API key
3. Copy the key

### HuggingFace (Free!)
1. Go to [huggingface.co](https://huggingface.co)
2. Create a free account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" access
5. Copy the token - no credit card required!

## 📊 Database Schema

### Tables

- **users**: User profiles with credits and plan
- **ideas**: Submitted startup ideas
- **verdicts**: AI-generated verdicts with reasoning
- **market_documents**: Vector-enabled market signals

### Row Level Security (RLS)

All tables have RLS enabled. Users can only access their own data.

## 🧠 How It Works

### User Flow

1. User signs up/logs in (Supabase Auth)
2. Submits structured idea form
3. System analyzes in real-time:
   - Collects market signals (Reddit, competitors, pricing)
   - Generates embeddings and stores in vector DB
   - Retrieves relevant context via similarity search
   - Calls Groq API with context-enriched prompt
4. Displays verdict with:
   - Go/Pivot/Kill decision
   - 3 reasoning bullets
   - Biggest hidden risk
   - Conditions for success
   - Next 3 actions
   - Confidence scores

### RAG Pipeline

```
Input Idea → Market Signal Collection → Embedding Generation → 
Vector Storage → Similarity Search → Context Retrieval → 
Groq API (with context) → Structured Verdict
```

## 🎨 Design Philosophy

- **Opinionated**: Clear decisions, no hedging
- **Fast**: Instant analysis, no waiting
- **Honest**: Brutally truthful feedback
- **Actionable**: Specific next steps

## 🚫 Non-Goals (Not Implemented)

- Payment gateway
- Team collaboration
- File uploads
- Chat interface
- Pitch deck generation

## 🔧 Development

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables in Production

Make sure to add all variables from `.env.local` to your deployment platform.

## 🗄️ Database Migrations

To update the schema:

1. Modify `supabase/schema.sql`
2. Run in Supabase SQL Editor
3. Update `lib/database.types.ts` if needed

## 🤖 AI Configuration

### Groq Model

Currently using `moonshotai/kimi-k2-instruct-0905`. To change:

Edit `lib/groq.ts`:

```typescript
model: 'your-preferred-model'
```

### Prompt Engineering

Modify the system prompt in `lib/groq.ts` to adjust the AI's personality and output format.

## 🔒 Security Notes

- Never commit `.env.local`
- Use service role key only in API routes (server-side)
- RLS policies protect user data
- Validate all inputs on the server

## 📝 License

MIT

## 🙋 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for founders who value their time**

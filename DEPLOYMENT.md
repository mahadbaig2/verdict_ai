# Verdict.ai Deployment Guide

## Prerequisites

- Supabase project configured with schema
- API keys for Groq and OpenAI
- Vercel account (recommended) or other hosting platform

## Deployment Steps

### 1. Prepare Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for provisioning

2. **Run Database Migrations**
   ```sql
   -- In Supabase SQL Editor, run in order:
   -- 1. supabase/schema.sql
   -- 2. supabase/functions.sql
   ```

3. **Enable Vector Extension**
   - Database → Extensions → Enable `vector`

4. **Verify Tables**
   - Check that users, ideas, verdicts, market_documents exist
   - Verify RLS policies are active

### 2. Configure Environment Variables

Set these in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
GROQ_API_KEY=gsk_xxx...
OPENAI_API_KEY=sk-xxx...
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables

# Deploy to production
vercel --prod
```

### 4. Post-Deployment Checks

- [ ] Landing page loads correctly
- [ ] Sign up creates user in Supabase
- [ ] Sign in works
- [ ] New idea form submits
- [ ] Verdict displays correctly
- [ ] Credits decrement

## Alternative Platforms

### Netlify

```bash
npm run build
# Deploy dist folder
```

### Railway

1. Connect GitHub repo
2. Add environment variables
3. Deploy

### Self-Hosted

```bash
npm run build
npm start
# Use PM2 or similar for process management
```

## Monitoring

### Supabase Dashboard

- Monitor database usage
- Check auth logs
- View API requests

### Groq Console

- Track API usage
- Monitor rate limits

### Application Logs

Check Vercel/platform logs for errors.

## Scaling Considerations

### Database

- Monitor vector search performance
- Add indexes if queries slow down
- Consider upgrading Supabase plan

### API Limits

- Groq: Check rate limits
- OpenAI: Monitor embedding costs
- Implement caching if needed

### Credits System

- Adjust free tier credits in schema
- Add paid plans (requires payment integration)

## Security Checklist

- [ ] Environment variables not in code
- [ ] RLS policies enabled
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] API routes validate auth tokens

## Troubleshooting

### "Unauthorized" errors
- Check Supabase keys
- Verify RLS policies
- Ensure auth token is passed

### Vector search not working
- Confirm vector extension enabled
- Check embedding dimensions (1536)
- Verify match_market_documents function exists

### Groq API errors
- Validate API key
- Check rate limits
- Ensure model name is correct

## Rollback Plan

If deployment fails:

1. Revert to previous Vercel deployment
2. Check environment variables
3. Verify database schema
4. Review recent code changes

## Backup Strategy

### Database

- Supabase provides automatic backups
- Export data regularly via SQL

### Code

- Use Git tags for releases
- Keep production branch stable

---

**Ready to deploy? Follow the steps above and you'll be live in minutes!**

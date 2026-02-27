# FIX: Netlify Deployment with Neo/NeonDB "org_id" Error

## What Causes This Error?

When deploying to Netlify and you see: **"Failed to create database: org_id is required"**

This means:
- You're trying to use **NeonDB** as your database
- NeonDB is trying to auto-create a database but doesn't have your organization ID
- Your project is actually configured for **Supabase** which doesn't need this

## Solution: Use Supabase (Recommended)

### Step 1: Set Environment Variables in Netlify

Go to your Netlify site  **Site Settings  Environment variables** and add:

`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_AI_API_KEY=your_api_key_here
`

**To find these values:**
1. Go to https://app.supabase.com
2. Select your project
3. Click **Settings  API** in the left menu
4. Copy the URL and anon key

### Step 2: Verify netlify.toml is Present

Check that `netlify.toml` exists in your root directory.

### Step 3: Redeploy

- Push a small change to trigger redeployment, OR
- Click **Deploy site** in Netlify dashboard

---

## Quick Checklist

- [ ] Supabase project created at https://supabase.com
- [ ] Environment variables added to Netlify dashboard
- [ ] Supabase URL and anon key are correct
- [ ] Google AI key is added
- [ ] Repository pushed to GitHub
- [ ] Netlify is connected to your repository
- [ ] `netlify.toml` exists in root directory

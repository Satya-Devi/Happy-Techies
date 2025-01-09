<h1 align="center">MCKUBA Job Board</h1>
<p align="center">
  A job board for Microsoft Technologies.
</p>

## Clone and run locally

1. Update `.env.local` with:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

2. You can now run the Next.js local development server (Example):

   ```bash
   npm run dev
   ```t 
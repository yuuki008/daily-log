This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Daily Log

## Supabase Setup

To run this application, you need to set up a database in Supabase.

### 1. Create Tables

In the Supabase dashboard, go to the "SQL Editor" and execute the following migration files in order:

1. **Create profiles table**
   - Copy and execute the contents of `supabase/migrations/01_create_profiles_table.sql`
2. **Create posts table**
   - Copy and execute the contents of `supabase/migrations/02_create_posts_table.sql`

### 2. Add Sample Data (Optional)

If you want to test in a development environment:

1. Create or sign up a user in the Supabase dashboard
2. Check the user ID in "Authentication" → "Users"
3. Open `supabase/migrations/03_insert_sample_posts.sql`
4. Replace `YOUR_USER_ID_HERE` with the actual user ID
5. Uncomment and execute in the SQL Editor

### 3. Set Up Storage (For Image Upload Feature)

If you want to upload images, create a storage bucket in Supabase:

1. Go to the "Storage" section in the Supabase dashboard
2. Create a new bucket named "posts-images"
3. Set the bucket policy to allow public read access

## Features

- Timeline-style post display
- Infinite scroll to load older posts
- Carousel display for multiple images
- Responsive design

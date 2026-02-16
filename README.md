# Smart Bookmark App

This is a Smart Bookmark Manager built with Next.js 15 (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS.

## Features

- **Google Authentication**: Sign up and log in using Google OAuth (no email/password).
- **Private Bookmarks**: Ensure bookmarks are visible only to the creator (Row Level Security).
- **Real-time Updates**: Bookmark list updates instantly across tabs/devices without refresh.
- **Add/Delete Bookmarks**: Manage your bookmark collection easily.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS
- **Icons**: Hand-crafted SVGs (Zero external icon dependency)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd smart-bookmark-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Setup

Run the SQL commands in `schema.sql` in your Supabase SQL Editor to create the `bookmarks` table and set up Row Level Security (RLS) policies.

**Important:** Enable "Realtime" for the `bookmarks` table in your Supabase Dashboard (Database -> Replication -> Source).

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1. Push your code to a GitHub repository.
2. Import the repository in Vercel.
3. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel Project Settings.
4. Deploy!

## Notes

- **Realtime**: The application uses Supabase Realtime to update the UI instantly when bookmarks are added or deleted.
- **Security**: RLS policies ensure users can only access their own data.

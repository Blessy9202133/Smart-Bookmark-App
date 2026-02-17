# Smart Bookmark App

A full-stack bookmark manager built with **Next.js 15 (App Router)**, **Supabase**, and **Tailwind CSS**.

This was built as part of a coding assignment to demonstrate full-stack capabilities, specifically focusing on authentication, database security, and real-time data synchronization.

## 🚀 Features

- **Google OAuth Only**: Simplified login experience using only Google Sign-In (no email/passwords).
- **Private Data**: Every user has their own private list of bookmarks, secured by Row Level Security (RLS).
- **Real-time Updates**: changes made in one tab/device reflect instantly in others without refreshing.
- **Responsive UI**: Clean, minimal interface built with Tailwind CSS.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Utilities**: Hand-crafted SVG icons (zero external icon library dependency to keep the bundle small)

---

## 💡 Challenges Faced & Solutions

During the development of this application, I encountered a few interesting challenges:

### 1. Enabling Real-time Updates
**The Problem:** Initially, my real-time subscription code in the frontend was correct, but no events were firing when I inserted data.
**The Solution:** I discovered that Supabase disables Realtime Replication by default for new tables to save resources. I had to manually enable "Replication" for the `bookmarks` table in the Supabase Dashboard (Database -> Replication settings).

### 2. Next.js Middleware & Session Management
**The Problem:** Next.js Server Components need valid cookies to render protected routes, but cookies can expire.
**The Solution:** I implemented a robust `middleware.ts` that refreshes the Supabase session before loading any Server Component. This ensures that the user stays logged in seamlessy and the server always has access to the latest auth state.

### 3. Row Level Security (RLS)
**The Problem:** I needed to ensure that User A could never see User B's bookmarks, even if they tried to access the API directly.
**The Solution:** I wrote SQL policies that strictly enforce `auth.uid() = user_id`. This means the database itself rejects any query attempting to access unauthorized data, providing a strong security layer beyond just the frontend logic.

---

## 📦 Setup Instructions

If you want to run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd smart-bookmark-app
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

4.  **Database Setup:**
    Run the SQL commands in `schema.sql` in your Supabase SQL Editor.
    *Important: Enable "Realtime" for the `bookmarks` table in Supabase Dashboard.*

5.  **Run Locally:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## 🚀 Deployment

The app is deployed on Vercel. You can view the live demo here: [Add Your Live URL Here]

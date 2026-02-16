import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    // Fetch initial bookmarks server-side for better performance/SEO
    const { data: initialBookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="w-full flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white dark:bg-gray-800 shadow-sm">
                <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                    <div className="font-bold text-xl">Smart Bookmarks</div>
                    <div className="flex items-center gap-4">
                        <span>Hey, {user.email}!</span>
                        <form action="/auth/signout" method="post">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 text-xs transition-colors"
                                type="submit"
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-4xl p-4 flex flex-col gap-8">
                <DashboardClient initialBookmarks={initialBookmarks || []} userId={user.id} />
            </main>
        </div>
    );
}

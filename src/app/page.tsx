import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import AuthButton from "@/components/AuthButton";

export default async function Home() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        // If the user is already logged in, redirect to the dashboard
        return redirect("/dashboard");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center gap-6 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Smart Bookmarks
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                    Manage your bookmarks efficiently and privately.
                </p>
                <AuthButton />
            </div>

            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <p>
                    Powered by{" "}
                    <a
                        href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                        target="_blank"
                        className="font-bold hover:underline"
                        rel="noreferrer"
                    >
                        Supabase
                    </a>{" "}
                    and{" "}
                    <a
                        href="https://nextjs.org/"
                        target="_blank"
                        className="font-bold hover:underline"
                        rel="noreferrer"
                    >
                        Next.js
                    </a>
                </p>
            </footer>
        </div>
    );
}

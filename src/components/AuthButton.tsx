"use client";

import { createClient } from "@/utils/supabase/client";

export default function AuthButton() {
    const supabase = createClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-300 shadow-sm transition-all text-sm"
        >
            <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google Logo"
                className="w-5 h-5"
            />
            Sign in with Google
        </button>
    );
}

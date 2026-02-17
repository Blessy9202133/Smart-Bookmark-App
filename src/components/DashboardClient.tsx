"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

type Bookmark = {
    id: number;
    user_id: string;
    title: string;
    url: string;
    created_at: string;
};

// SVG Icons – fixed for React/TS
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <g>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </g>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <g>
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
    </g>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <g>
    <line x1="10" y1="14" x2="21" y2="3" />
    </g>
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function DashboardClient({
    initialBookmarks,
    userId,
}: {
    initialBookmarks: Bookmark[];
    userId: string;
}) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);
    const [newTitle, setNewTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        // Realtime subscription
        const channel = supabase
            .channel("realtime bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
                    } else if (payload.eventType === "DELETE") {
                        setBookmarks((prev) =>
                            prev.filter((bookmark) => bookmark.id !== payload.old.id)
                        );
                    } else if (payload.eventType === "UPDATE") {
                        setBookmarks((prev) =>
                            prev.map((bookmark) =>
                                bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, userId]);

    const addBookmark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newUrl) return;

        setIsAdding(true);
        const { error } = await supabase.from("bookmarks").insert({
            title: newTitle,
            url: newUrl,
            user_id: userId,
        });

        if (error) {
            console.error("Error adding bookmark:", error);
            alert("Error adding bookmark");
        } else {
            setNewTitle("");
            setNewUrl("");
        }
        setIsAdding(false);
    };

    const deleteBookmark = async (id: number) => {
        if (!confirm("Are you sure you want to delete this bookmark?")) return;
        const { error } = await supabase.from("bookmarks").delete().eq("id", id);
        if (error) {
            console.error("Error deleting bookmark:", error);
            alert("Error deleting bookmark");
        }
    };

    return (
        <div className="animate-in fade-in zoom-in duration-300">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Add a new bookmark</h2>
                <form onSubmit={addBookmark} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Title (e.g., Google DeepMind)"
                        className="flex-1 p-2 border border-gray-300 rounded-md bg-transparent dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                    />
                    <input
                        type="url"
                        placeholder="URL (e.g., https://deepmind.google)"
                        className="flex-1 p-2 border border-gray-300 rounded-md bg-transparent dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={isAdding}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAdding ? <LoaderIcon /> : <PlusIcon />}
                        Add
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {bookmarks.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        No bookmarks yet. Add one above!
                    </div>
                ) : (
                    bookmarks.map((bookmark) => (
                        <div
                            key={bookmark.id}
                            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all hover:shadow-md"
                        >
                            <div className="flex-1 min-w-0 pr-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {bookmark.title}
                                </h3>
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 flex items-center gap-1 truncate"
                                >
                                    {bookmark.url} <ExternalLinkIcon />
                                </a>
                            </div>
                            <button
                                onClick={() => deleteBookmark(bookmark.id)}
                                className="mt-2 sm:mt-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Delete bookmark"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Editor } from "@/components/Editor";
import { PresenceBar } from "@/components/PresenceBar";
import { Controls } from "@/components/Controls";
import { getOrCreateIdentity } from "@/lib/identity";
import { createYjsContext, type YjsContext } from "@/lib/yjs";
import { cn } from "@/lib/utils";

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;

    const [yjsContext, setYjsContext] = useState<YjsContext | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSynced, setIsSynced] = useState(false);

    // Initialize Yjs on mount
    useEffect(() => {
        if (!roomId) {
            router.push("/");
            return;
        }

        const identity = getOrCreateIdentity();
        const context = createYjsContext(roomId, identity);

        // Listen for sync events
        context.persistence.once("synced", () => {
            setIsSynced(true);
            setIsLoading(false);
        });

        // Fallback timeout in case sync event doesn't fire
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        setYjsContext(context);

        return () => {
            clearTimeout(timeout);
            context.destroy();
        };
    }, [roomId, router]);

    // Handle creating a new room
    const handleNewRoom = useCallback(() => {
        const { generateRoomId } = require("@/lib/utils");
        const newRoomId = generateRoomId();
        router.push(`/r/${newRoomId}`);
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 shadow-glow mb-6 animate-pulse">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        Loading your pad...
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Connecting to collaborators
                    </p>
                </div>
            </div>
        );
    }

    if (!yjsContext) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">
                        Failed to initialize
                    </h2>
                    <Link
                        href="/"
                        className="text-primary-500 hover:underline"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col page-enter">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    {/* Logo / Home Link */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </div>
                        <span className="font-bold text-lg hidden sm:inline">ScriblePad</span>
                    </Link>

                    {/* Presence Bar */}
                    <PresenceBar
                        awareness={yjsContext.awareness}
                        className="hidden md:flex"
                    />

                    {/* New Room Button */}
                    <button
                        onClick={handleNewRoom}
                        className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5",
                            "text-sm font-medium text-gray-600 dark:text-gray-300",
                            "hover:text-primary-600 dark:hover:text-primary-400",
                            "transition-colors"
                        )}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        New
                    </button>
                </div>

                {/* Mobile Presence Bar */}
                <div className="md:hidden px-4 pb-3">
                    <PresenceBar awareness={yjsContext.awareness} />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
                {/* Sync Status Indicator */}
                <div className="flex items-center gap-2 mb-6">
                    <div
                        className={cn(
                            "w-2 h-2 rounded-full",
                            isSynced ? "bg-green-500" : "bg-yellow-500 animate-pulse"
                        )}
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {isSynced ? "Synced" : "Syncing..."}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                        · Room: {roomId}
                    </span>
                </div>

                {/* Editor Area */}
                <div className="glass-card rounded-2xl p-6 md:p-8 mb-6 shadow-lg">
                    {/* Title */}
                    <Editor
                        yText={yjsContext.titleText}
                        placeholder="Untitled Note"
                        isTitle
                        className="mb-4"
                    />

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-6" />

                    {/* Content */}
                    <Editor
                        yText={yjsContext.contentText}
                        placeholder="Start writing your note here..."
                        showCharCount
                    />
                </div>

                {/* Controls */}
                <Controls
                    roomId={roomId}
                    titleText={yjsContext.titleText}
                    contentText={yjsContext.contentText}
                />
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-sm text-gray-400 dark:text-gray-500">
                <p>
                    Changes are saved automatically ·{" "}
                    <Link href="/" className="text-primary-500 hover:underline">
                        Create new pad
                    </Link>
                </p>
            </footer>
        </div>
    );
}

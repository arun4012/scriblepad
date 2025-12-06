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
            <div className="min-h-screen flex items-center justify-center ambient-bg">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-glow-lg mb-6 pulse-glow">
                        <svg
                            className="w-10 h-10 text-white animate-pulse"
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
                    <h2 className="text-xl md:text-2xl font-bold text-surface-900 dark:text-white mb-2">
                        Loading your pad...
                    </h2>
                    <p className="text-surface-700/70 dark:text-gray-400">
                        Connecting to collaborators
                    </p>
                </div>
            </div>
        );
    }

    if (!yjsContext) {
        return (
            <div className="min-h-screen flex items-center justify-center ambient-bg">
                <div className="text-center glass-card p-8 rounded-2xl">
                    <h2 className="text-xl font-bold text-red-600 mb-4">
                        Failed to initialize
                    </h2>
                    <Link
                        href="/"
                        className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col page-enter ambient-bg">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-header">
                <div className="max-w-5xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
                    {/* Logo / Home Link */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                    >
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow">
                            <svg
                                className="w-4 h-4 md:w-5 md:h-5 text-white"
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
                            "inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5",
                            "text-sm font-semibold rounded-xl",
                            "bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-gray-300",
                            "hover:bg-primary-50 dark:hover:bg-primary-900/30",
                            "hover:text-primary-600 dark:hover:text-primary-400",
                            "transition-all duration-200 touch-target"
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
                        <span className="hidden sm:inline">New Pad</span>
                    </button>
                </div>

                {/* Mobile Presence Bar */}
                <div className="md:hidden px-4 pb-3">
                    <PresenceBar awareness={yjsContext.awareness} />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
                {/* Sync Status Indicator */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                        <div
                            className={cn(
                                "w-2.5 h-2.5 rounded-full",
                                isSynced
                                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                    : "bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                            )}
                        />
                        <span className="text-sm font-medium text-surface-700 dark:text-gray-300">
                            {isSynced ? "Synced" : "Syncing..."}
                        </span>
                    </div>
                    <span className="text-sm text-surface-700/50 dark:text-gray-500 font-mono">
                        {roomId}
                    </span>
                </div>

                {/* Editor Area */}
                <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8 mb-6 shadow-soft-lg">
                    {/* Title */}
                    <Editor
                        yText={yjsContext.titleText}
                        placeholder="Untitled Note"
                        isTitle
                        maxLength={20}
                        className="mb-4"
                    />

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-primary-300/50 dark:via-primary-600/30 to-transparent mb-6" />

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
            <footer className="py-5 text-center text-sm text-surface-700/50 dark:text-gray-500 safe-bottom">
                <p>
                    Changes are saved automatically ·{" "}
                    <Link href="/" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                        Create new pad
                    </Link>
                </p>
            </footer>
        </div>
    );
}

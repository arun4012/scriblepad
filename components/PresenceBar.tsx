"use client";

import { useEffect, useState } from "react";
import type YPartyKitProvider from "y-partykit/provider";
import { getAwarenessUsers, type AwarenessUser } from "@/lib/yjs";
import { cn } from "@/lib/utils";

interface PresenceBarProps {
    awareness: YPartyKitProvider["awareness"];
    className?: string;
}

export function PresenceBar({ awareness, className }: PresenceBarProps) {
    const [users, setUsers] = useState<AwarenessUser[]>([]);

    useEffect(() => {
        const updateUsers = () => {
            setUsers(getAwarenessUsers(awareness));
        };

        // Initial update
        updateUsers();

        // Listen for awareness changes
        awareness.on("change", updateUsers);

        return () => {
            awareness.off("change", updateUsers);
        };
    }, [awareness]);

    if (users.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                "flex items-center gap-3 px-4 py-2.5",
                "bg-white/80 dark:bg-surface-800/80",
                "backdrop-blur-md rounded-full",
                "border border-surface-200/60 dark:border-surface-700/60",
                "shadow-soft",
                className
            )}
        >
            {/* User count badge */}
            <div className="flex items-center gap-1.5 text-sm text-surface-600 dark:text-gray-400">
                <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                    <svg
                        className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                </div>
                <span className="font-semibold text-surface-700 dark:text-gray-300">{users.length}</span>
            </div>

            <div className="h-5 w-px bg-surface-200 dark:bg-surface-700" />

            {/* User avatars */}
            <div className="flex items-center -space-x-2">
                {users.slice(0, 5).map((user, index) => (
                    <div
                        key={user.clientId}
                        className="relative group"
                        style={{ zIndex: 5 - index }}
                    >
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                "text-white text-xs font-bold",
                                "ring-2 ring-white dark:ring-surface-800",
                                "transition-all duration-200",
                                "hover:scale-110 hover:ring-primary-400 dark:hover:ring-primary-500",
                                "shadow-md hover:shadow-lg"
                            )}
                            style={{
                                background: `linear-gradient(135deg, ${user.color} 0%, ${adjustColor(user.color, -20)} 100%)`
                            }}
                        >
                            {user.name.slice(0, 2).toUpperCase()}
                        </div>

                        {/* Tooltip */}
                        <div
                            className={cn(
                                "absolute top-full left-1/2 -translate-x-1/2 mt-2",
                                "px-3 py-1.5 bg-surface-900 dark:bg-surface-700 text-white text-xs font-medium rounded-lg",
                                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                                "pointer-events-none whitespace-nowrap z-50",
                                "shadow-lg"
                            )}
                        >
                            {user.name}
                            <div
                                className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0"
                                style={{
                                    borderLeft: "5px solid transparent",
                                    borderRight: "5px solid transparent",
                                    borderBottom: "5px solid rgb(15 23 42)",
                                }}
                            />
                        </div>
                    </div>
                ))}

                {users.length > 5 && (
                    <div
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            "bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-600",
                            "text-surface-600 dark:text-gray-200",
                            "text-xs font-bold",
                            "ring-2 ring-white dark:ring-surface-800",
                            "shadow-md"
                        )}
                    >
                        +{users.length - 5}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper function to darken/lighten a hex color
function adjustColor(color: string, amount: number): string {
    const clamp = (val: number) => Math.max(0, Math.min(255, val));

    // Parse hex color
    let hex = color.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = clamp(r + amount);
    const newG = clamp(g + amount);
    const newB = clamp(b + amount);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

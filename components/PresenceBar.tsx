"use client";

import { useEffect, useState } from "react";
import type { WebrtcProvider } from "y-webrtc";
import { getAwarenessUsers, type AwarenessUser } from "@/lib/yjs";
import { cn } from "@/lib/utils";

interface PresenceBarProps {
    awareness: WebrtcProvider["awareness"];
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
                "flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-gray-800/50",
                "backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50",
                "shadow-sm",
                className
            )}
        >
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                <span className="font-medium">{users.length}</span>
            </div>

            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />

            <div className="flex items-center -space-x-2">
                {users.slice(0, 5).map((user) => (
                    <div
                        key={user.clientId}
                        className="relative group"
                    >
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                "text-white text-xs font-bold",
                                "ring-2 ring-white dark:ring-gray-800",
                                "transition-transform hover:scale-110 hover:z-10"
                            )}
                            style={{ backgroundColor: user.color }}
                        >
                            {user.name.slice(0, 2).toUpperCase()}
                        </div>

                        {/* Tooltip */}
                        <div
                            className={cn(
                                "absolute top-full left-1/2 -translate-x-1/2 mt-2",
                                "px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded",
                                "opacity-0 group-hover:opacity-100 transition-opacity",
                                "pointer-events-none whitespace-nowrap z-50"
                            )}
                        >
                            {user.name}
                            <div
                                className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0"
                                style={{
                                    borderLeft: "4px solid transparent",
                                    borderRight: "4px solid transparent",
                                    borderBottom: "4px solid rgb(17 24 39)",
                                }}
                            />
                        </div>
                    </div>
                ))}

                {users.length > 5 && (
                    <div
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200",
                            "text-xs font-bold ring-2 ring-white dark:ring-gray-800"
                        )}
                    >
                        +{users.length - 5}
                    </div>
                )}
            </div>
        </div>
    );
}

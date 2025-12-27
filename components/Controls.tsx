"use client";

import { useState } from "react";
import * as Y from "yjs";
import {
    copyToClipboard,
    downloadFile,
    formatAsMarkdown,
    getRoomUrl,
    cn,
} from "@/lib/utils";
import { Toast } from "./Toast";
import type { Version } from "@/lib/versions";

interface ControlsProps {
    roomId: string;
    titleText: Y.Text;
    contentText: Y.Text;
    metadataMap: Y.Map<string>;
    versionsArray: Y.Array<Version>;
    isPasswordProtected: boolean;
    onPasswordClick: () => void;
    onHistoryClick: () => void;
    onChatClick: () => void;
    unreadChatCount?: number;
    className?: string;
}

export function Controls({
    roomId,
    titleText,
    contentText,
    isPasswordProtected,
    onPasswordClick,
    onHistoryClick,
    onChatClick,
    unreadChatCount = 0,
    className,
}: ControlsProps) {
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
    };

    const handleCopyLink = async () => {
        const url = getRoomUrl(roomId);
        const success = await copyToClipboard(url);
        if (success) {
            showToast("Link copied to clipboard!");
        } else {
            showToast("Failed to copy link", "error");
        }
    };

    const handleExportTxt = () => {
        const title = titleText.toString() || "Untitled";
        const content = contentText.toString();
        const fullContent = `${title}\n${"=".repeat(title.length)}\n\n${content}`;
        const filename = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
        downloadFile(fullContent, filename, "text/plain");
        showToast("Downloaded as .txt");
    };

    const handleExportMd = () => {
        const title = titleText.toString() || "Untitled";
        const content = contentText.toString();
        const markdown = formatAsMarkdown(title, content);
        const filename = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
        downloadFile(markdown, filename, "text/markdown");
        showToast("Downloaded as .md");
    };

    // Common button styles
    const secondaryButtonClass = cn(
        "group inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3",
        "bg-paper-200 dark:bg-ink-800",
        "hover:bg-paper-300 dark:hover:bg-ink-700",
        "text-ink-600 dark:text-ink-300",
        "border border-paper-300 dark:border-ink-700",
        "hover:border-paper-400 dark:hover:border-ink-600",
        "rounded-xl font-medium text-sm md:text-base",
        "transition-all duration-200",
        "active:scale-[0.98]",
        "touch-target"
    );

    const iconClass = "w-4 h-4 md:w-5 md:h-5 text-ink-500 dark:text-ink-400 group-hover:text-ink-700 dark:group-hover:text-ink-200 transition-colors";

    return (
        <>
            <div className={cn("flex items-center gap-2 md:gap-3 flex-wrap", className)}>
                {/* Copy Link Button - Primary Action */}
                <button
                    onClick={handleCopyLink}
                    className={cn(
                        "group inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3",
                        "bg-primary-600 hover:bg-primary-700 text-white",
                        "rounded-xl font-semibold text-sm md:text-base",
                        "transition-all duration-200",
                        "shadow-soft hover:shadow-soft-md",
                        "active:scale-[0.98]",
                        "touch-target"
                    )}
                >
                    <svg
                        className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                    <span>Share Link</span>
                </button>

                {/* Password Button */}
                <button
                    onClick={onPasswordClick}
                    className={cn(
                        secondaryButtonClass,
                        isPasswordProtected && "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700"
                    )}
                    title={isPasswordProtected ? "Password protected" : "Set password"}
                >
                    <svg
                        className={cn(
                            iconClass,
                            isPasswordProtected && "text-amber-600 dark:text-amber-400"
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isPasswordProtected
                                ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                : "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                            }
                        />
                    </svg>
                    <span className="hidden sm:inline">
                        {isPasswordProtected ? "Protected" : "Password"}
                    </span>
                </button>

                {/* History Button */}
                <button
                    onClick={onHistoryClick}
                    className={secondaryButtonClass}
                    title="Version history"
                >
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="hidden sm:inline">History</span>
                </button>

                {/* Chat Button */}
                <button
                    onClick={onChatClick}
                    className={cn(
                        secondaryButtonClass,
                        "relative",
                        unreadChatCount > 0 && "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700"
                    )}
                    title="Chat with collaborators"
                >
                    <svg
                        className={cn(
                            iconClass,
                            unreadChatCount > 0 && "text-emerald-600 dark:text-emerald-400"
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    <span className="hidden sm:inline">Chat</span>
                    {unreadChatCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {unreadChatCount > 9 ? "9+" : unreadChatCount}
                        </span>
                    )}
                </button>

                {/* Export .txt Button */}
                <button
                    onClick={handleExportTxt}
                    className={secondaryButtonClass}
                >
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <span className="hidden sm:inline">.txt</span>
                    <span className="sm:hidden">TXT</span>
                </button>

                {/* Export .md Button */}
                <button
                    onClick={handleExportMd}
                    className={secondaryButtonClass}
                >
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                    </svg>
                    <span className="hidden sm:inline">.md</span>
                    <span className="sm:hidden">MD</span>
                </button>
            </div>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}

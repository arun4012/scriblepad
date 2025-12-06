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

interface ControlsProps {
    roomId: string;
    titleText: Y.Text;
    contentText: Y.Text;
    className?: string;
}

export function Controls({
    roomId,
    titleText,
    contentText,
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

    return (
        <>
            <div className={cn("flex items-center gap-2 flex-wrap", className)}>
                {/* Copy Link Button */}
                <button
                    onClick={handleCopyLink}
                    className={cn(
                        "inline-flex items-center gap-2 px-4 py-2",
                        "bg-primary-500 hover:bg-primary-600 text-white",
                        "rounded-lg font-medium text-sm",
                        "transition-all duration-200",
                        "hover:shadow-lg hover:shadow-primary-500/25",
                        "active:scale-95"
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
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                    Share Link
                </button>

                {/* Export .txt Button */}
                <button
                    onClick={handleExportTxt}
                    className={cn(
                        "inline-flex items-center gap-2 px-4 py-2",
                        "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
                        "text-gray-700 dark:text-gray-200",
                        "rounded-lg font-medium text-sm",
                        "transition-all duration-200",
                        "active:scale-95"
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
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    Export .txt
                </button>

                {/* Export .md Button */}
                <button
                    onClick={handleExportMd}
                    className={cn(
                        "inline-flex items-center gap-2 px-4 py-2",
                        "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
                        "text-gray-700 dark:text-gray-200",
                        "rounded-lg font-medium text-sm",
                        "transition-all duration-200",
                        "active:scale-95"
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
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                    </svg>
                    Export .md
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

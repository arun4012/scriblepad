"use client";

import { useState, useEffect } from "react";
import * as Y from "yjs";
import { cn } from "@/lib/utils";
import {
    type Version,
    getVersions,
    restoreVersion,
    formatVersionTime,
} from "@/lib/versions";

interface VersionHistoryProps {
    titleText: Y.Text;
    contentText: Y.Text;
    versionsArray: Y.Array<Version>;
    isOpen: boolean;
    onClose: () => void;
}

export function VersionHistory({
    titleText,
    contentText,
    versionsArray,
    isOpen,
    onClose,
}: VersionHistoryProps) {
    const [versions, setVersions] = useState<Version[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);

    // Load versions when panel opens
    useEffect(() => {
        if (isOpen) {
            const loadedVersions = getVersions(versionsArray);
            // Sort by timestamp descending (newest first)
            setVersions([...loadedVersions].reverse());
            setSelectedVersion(null);
        }
    }, [isOpen, versionsArray]);

    // Listen for version changes
    useEffect(() => {
        const observer = () => {
            const loadedVersions = getVersions(versionsArray);
            setVersions([...loadedVersions].reverse());
        };

        versionsArray.observe(observer);
        return () => versionsArray.unobserve(observer);
    }, [versionsArray]);

    const handleRestore = () => {
        if (!selectedVersion) return;

        setIsRestoring(true);
        try {
            restoreVersion(titleText, contentText, selectedVersion);
            onClose();
        } finally {
            setIsRestoring(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={cn(
                    "fixed z-50 bg-white dark:bg-surface-900 shadow-2xl",
                    "flex flex-col",
                    // Mobile: bottom sheet
                    "inset-x-0 bottom-0 max-h-[70vh] rounded-t-2xl",
                    // Desktop: side panel
                    "md:inset-y-0 md:right-0 md:left-auto md:w-96 md:max-h-none md:rounded-l-2xl md:rounded-tr-none",
                    "animate-in slide-in-from-bottom md:slide-in-from-right duration-300"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-500 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-bold text-surface-900 dark:text-white">
                                Version History
                            </h2>
                            <p className="text-sm text-surface-500 dark:text-gray-400">
                                {versions.length} version{versions.length !== 1 ? "s" : ""} saved
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Version List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {versions.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                                <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-surface-600 dark:text-gray-400 font-medium">
                                No versions yet
                            </p>
                            <p className="text-sm text-surface-500 dark:text-gray-500 mt-1">
                                Versions are saved automatically as you edit
                            </p>
                        </div>
                    ) : (
                        versions.map((version, index) => (
                            <button
                                key={version.id}
                                onClick={() => setSelectedVersion(
                                    selectedVersion?.id === version.id ? null : version
                                )}
                                className={cn(
                                    "w-full text-left p-3 rounded-xl border transition-all",
                                    selectedVersion?.id === version.id
                                        ? "bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700"
                                        : "bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600"
                                )}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-surface-900 dark:text-white truncate">
                                            {version.titleSnapshot || "Untitled"}
                                        </p>
                                        <p className="text-sm text-surface-500 dark:text-gray-400 mt-0.5">
                                            {formatVersionTime(version.timestamp)}
                                        </p>
                                    </div>
                                    {index === 0 && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                                            Latest
                                        </span>
                                    )}
                                </div>
                                {selectedVersion?.id === version.id && (
                                    <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                                        <p className="text-xs text-surface-500 dark:text-gray-400 uppercase font-medium mb-1">
                                            Preview
                                        </p>
                                        <p className="text-sm text-surface-600 dark:text-gray-300 line-clamp-3">
                                            {version.contentSnapshot || "(empty)"}
                                        </p>
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* Footer Actions */}
                {selectedVersion && (
                    <div className="p-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                        <button
                            onClick={handleRestore}
                            disabled={isRestoring}
                            className={cn(
                                "w-full py-3 px-4 rounded-xl font-semibold text-white",
                                "bg-gradient-to-r from-primary-500 to-purple-600",
                                "hover:shadow-lg hover:shadow-primary-500/30",
                                "transition-all duration-200",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            {isRestoring ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Restoring...
                                </span>
                            ) : (
                                <>
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Restore This Version
                                    </span>
                                </>
                            )}
                        </button>
                        <p className="text-xs text-center text-surface-500 dark:text-gray-400 mt-2">
                            This will replace current content
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

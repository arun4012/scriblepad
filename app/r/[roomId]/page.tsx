"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Editor } from "@/components/Editor";
import { PresenceBar } from "@/components/PresenceBar";
import { Controls } from "@/components/Controls";
import { PasswordModal } from "@/components/PasswordModal";
import { VersionHistory } from "@/components/VersionHistory";
import { ChatPanel } from "@/components/ChatPanel";
import { getOrCreateIdentity, type UserIdentity } from "@/lib/identity";
import { createYjsContext, type YjsContext } from "@/lib/yjs";
import { cn } from "@/lib/utils";
import { hashPassword, verifyPassword } from "@/lib/password";
import { captureVersion, getVersions, hasSignificantChange } from "@/lib/versions";

// Auto-save interval (5 minutes)
const AUTO_SAVE_INTERVAL = 5 * 60 * 1000;

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;

    const [yjsContext, setYjsContext] = useState<YjsContext | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSynced, setIsSynced] = useState(false);

    // Password state
    const [isPasswordProtected, setIsPasswordProtected] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordModalMode, setPasswordModalMode] = useState<"set" | "unlock" | "remove">("set");
    const [passwordError, setPasswordError] = useState("");
    const [isProcessingPassword, setIsProcessingPassword] = useState(false);

    // Version history state
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Chat state
    const [showChatPanel, setShowChatPanel] = useState(false);
    const [unreadChatCount, setUnreadChatCount] = useState(0);
    const [userIdentity, setUserIdentity] = useState<UserIdentity | null>(null);

    // Initialize Yjs on mount
    useEffect(() => {
        if (!roomId) {
            router.push("/");
            return;
        }

        const identity = getOrCreateIdentity();
        setUserIdentity(identity);
        const context = createYjsContext(roomId, identity);

        // Listen for sync events
        context.persistence.once("synced", () => {
            setIsSynced(true);
        });

        // Check password status from metadata
        const checkPasswordStatus = () => {
            const hash = context.metadataMap.get("passwordHash");
            const hasPassword = !!hash && hash.length > 0;
            setIsPasswordProtected(hasPassword);

            if (hasPassword) {
                // Need to unlock
                setIsUnlocked(false);
                setPasswordModalMode("unlock");
                setShowPasswordModal(true);
            } else {
                // No password, auto-unlock
                setIsUnlocked(true);
            }
        };

        // Listen for metadata changes
        context.metadataMap.observe(() => {
            const hash = context.metadataMap.get("passwordHash");
            setIsPasswordProtected(!!hash && hash.length > 0);
        });

        // Check after sync to cloud
        context.provider.on("sync", () => {
            checkPasswordStatus();
        });

        // Also check immediately in case already synced
        setTimeout(checkPasswordStatus, 500);

        setYjsContext(context);
        setIsLoading(false);

        return () => {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
            context.destroy();
        };
    }, [roomId, router]);

    // Auto-save versions periodically
    useEffect(() => {
        if (!yjsContext || !isUnlocked) return;

        autoSaveTimerRef.current = setInterval(() => {
            const versions = getVersions(yjsContext.versionsArray);
            const currentTitle = yjsContext.titleText.toString();
            const currentContent = yjsContext.contentText.toString();

            if (hasSignificantChange(currentTitle, currentContent, versions)) {
                captureVersion(yjsContext.titleText, yjsContext.contentText, yjsContext.versionsArray);
            }
        }, AUTO_SAVE_INTERVAL);

        return () => {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
        };
    }, [yjsContext, isUnlocked]);

    // Save a version on first meaningful content
    useEffect(() => {
        if (!yjsContext || !isUnlocked) return;

        const saveInitialVersion = () => {
            const versions = getVersions(yjsContext.versionsArray);
            const currentContent = yjsContext.contentText.toString();

            // Save first version when there's meaningful content
            if (versions.length === 0 && currentContent.length > 20) {
                captureVersion(yjsContext.titleText, yjsContext.contentText, yjsContext.versionsArray);
            }
        };

        // Check after a short delay to let initial sync complete
        const timer = setTimeout(saveInitialVersion, 2000);
        return () => clearTimeout(timer);
    }, [yjsContext, isUnlocked]);

    // Handle password actions
    const handlePasswordClick = useCallback(() => {
        if (isPasswordProtected) {
            // Already protected - show remove modal
            setPasswordModalMode("remove");
        } else {
            // Not protected - show set modal
            setPasswordModalMode("set");
        }
        setPasswordError("");
        setShowPasswordModal(true);
    }, [isPasswordProtected]);

    const handlePasswordSubmit = useCallback(async (password: string) => {
        if (!yjsContext) return;
        setIsProcessingPassword(true);
        setPasswordError("");

        try {
            if (passwordModalMode === "set") {
                // Set new password
                const hash = await hashPassword(password);
                yjsContext.metadataMap.set("passwordHash", hash);
                setIsPasswordProtected(true);
                setIsUnlocked(true);
                setShowPasswordModal(false);
            } else if (passwordModalMode === "unlock") {
                // Verify password
                const hash = yjsContext.metadataMap.get("passwordHash") || "";
                const isValid = await verifyPassword(password, hash);
                if (isValid) {
                    setIsUnlocked(true);
                    setShowPasswordModal(false);
                } else {
                    setPasswordError("Incorrect password");
                }
            } else if (passwordModalMode === "remove") {
                // Verify and remove password
                const hash = yjsContext.metadataMap.get("passwordHash") || "";
                const isValid = await verifyPassword(password, hash);
                if (isValid) {
                    yjsContext.metadataMap.delete("passwordHash");
                    setIsPasswordProtected(false);
                    setShowPasswordModal(false);
                } else {
                    setPasswordError("Incorrect password");
                }
            }
        } catch (error) {
            setPasswordError("An error occurred");
        } finally {
            setIsProcessingPassword(false);
        }
    }, [yjsContext, passwordModalMode]);

    // Handle version history
    const handleHistoryClick = useCallback(() => {
        if (!yjsContext) return;

        // Save current version before showing history
        const versions = getVersions(yjsContext.versionsArray);
        const currentTitle = yjsContext.titleText.toString();
        const currentContent = yjsContext.contentText.toString();

        if (hasSignificantChange(currentTitle, currentContent, versions)) {
            captureVersion(yjsContext.titleText, yjsContext.contentText, yjsContext.versionsArray);
        }

        setShowVersionHistory(true);
    }, [yjsContext]);

    // Handle chat
    const handleChatClick = useCallback(() => {
        setShowChatPanel(true);
        setUnreadChatCount(0);
    }, []);

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
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 shadow-soft-lg mb-6">
                        <svg
                            className="w-8 h-8 text-white animate-pulse"
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
                    <h2 className="text-xl md:text-2xl font-bold text-ink-900 dark:text-white mb-2">
                        Loading your pad...
                    </h2>
                    <p className="text-ink-500 dark:text-ink-400">
                        Connecting to collaborators
                    </p>
                </div>
            </div>
        );
    }

    if (!yjsContext) {
        return (
            <div className="min-h-screen flex items-center justify-center ambient-bg">
                <div className="text-center card-paper p-8">
                    <h2 className="text-xl font-bold text-red-600 mb-4">
                        Failed to initialize
                    </h2>
                    <Link
                        href="/"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium transition-colors"
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
                        className="flex items-center gap-2 text-ink-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                    >
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-soft group-hover:shadow-soft-md transition-shadow">
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
                            "bg-paper-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300",
                            "border border-paper-300 dark:border-ink-700",
                            "hover:bg-paper-300 dark:hover:bg-ink-700",
                            "hover:border-paper-400 dark:hover:border-ink-600",
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
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper-200 dark:bg-ink-800 border border-paper-300 dark:border-ink-700">
                        <div
                            className={cn(
                                "w-2 h-2 rounded-full",
                                isSynced
                                    ? "bg-emerald-500"
                                    : "bg-amber-500 animate-pulse"
                            )}
                        />
                        <span className="text-sm font-medium text-ink-600 dark:text-ink-300">
                            {isSynced ? "Synced" : "Syncing..."}
                        </span>
                    </div>
                    {isPasswordProtected && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Protected</span>
                        </div>
                    )}
                    <span className="text-sm text-ink-400 dark:text-ink-500 font-mono">
                        {roomId}
                    </span>
                </div>

                {/* Editor Area - Locked Overlay when password protected but not unlocked */}
                <div className="relative">
                    {isPasswordProtected && !isUnlocked && (
                        <div className="absolute inset-0 z-30 bg-white/90 dark:bg-ink-900/95 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-ink-900 dark:text-white mb-2">
                                    This pad is protected
                                </h3>
                                <p className="text-ink-500 dark:text-ink-400 mb-4">
                                    Enter the password to view and edit
                                </p>
                                <button
                                    onClick={() => {
                                        setPasswordModalMode("unlock");
                                        setShowPasswordModal(true);
                                    }}
                                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-soft hover:shadow-soft-md transition-all"
                                >
                                    Unlock Pad
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="card-paper p-5 md:p-8 mb-6">
                        {/* Title */}
                        <Editor
                            yText={yjsContext.titleText}
                            placeholder="Untitled Note"
                            isTitle
                            maxLength={20}
                            className="mb-4"
                        />

                        {/* Divider */}
                        <div className="h-px bg-paper-300 dark:bg-ink-700 mb-6" />

                        {/* Content */}
                        <Editor
                            yText={yjsContext.contentText}
                            placeholder="Start writing your note here..."
                            showCharCount
                        />
                    </div>
                </div>

                {/* Controls */}
                <Controls
                    roomId={roomId}
                    titleText={yjsContext.titleText}
                    contentText={yjsContext.contentText}
                    metadataMap={yjsContext.metadataMap}
                    versionsArray={yjsContext.versionsArray}
                    isPasswordProtected={isPasswordProtected}
                    onPasswordClick={handlePasswordClick}
                    onHistoryClick={handleHistoryClick}
                    onChatClick={handleChatClick}
                    unreadChatCount={unreadChatCount}
                />
            </main>

            {/* Footer */}
            <footer className="py-5 text-center text-sm text-ink-400 dark:text-ink-500 safe-bottom">
                <p>
                    Changes are saved automatically ·{" "}
                    <Link href="/" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
                        Create new pad
                    </Link>
                </p>
            </footer>

            {/* Password Modal */}
            {showPasswordModal && (
                <PasswordModal
                    mode={passwordModalMode}
                    onSubmit={handlePasswordSubmit}
                    onClose={() => {
                        // Don't allow closing if unlocking a protected pad
                        if (passwordModalMode !== "unlock" || !isPasswordProtected) {
                            setShowPasswordModal(false);
                        }
                    }}
                    error={passwordError}
                    isLoading={isProcessingPassword}
                />
            )}

            {/* Version History Panel */}
            <VersionHistory
                titleText={yjsContext.titleText}
                contentText={yjsContext.contentText}
                versionsArray={yjsContext.versionsArray}
                isOpen={showVersionHistory}
                onClose={() => setShowVersionHistory(false)}
            />

            {/* Chat Panel */}
            {userIdentity && (
                <ChatPanel
                    chatMessages={yjsContext.chatMessages}
                    userName={userIdentity.name}
                    userColor={userIdentity.color}
                    isOpen={showChatPanel}
                    onClose={() => setShowChatPanel(false)}
                    onUnreadChange={setUnreadChatCount}
                />
            )}
        </div>
    );
}

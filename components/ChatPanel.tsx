"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as Y from "yjs";
import { cn } from "@/lib/utils";
import {
    type ChatMessage,
    getMessages,
    sendMessage,
    formatChatTime,
} from "@/lib/chat";

interface ChatPanelProps {
    chatMessages: Y.Array<ChatMessage>;
    userName: string;
    userColor: string;
    isOpen: boolean;
    onClose: () => void;
    onUnreadChange?: (count: number) => void;
}

export function ChatPanel({
    chatMessages,
    userName,
    userColor,
    isOpen,
    onClose,
    onUnreadChange,
}: ChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastSeenCountRef = useRef(0);

    // Load messages when panel opens
    useEffect(() => {
        const loadedMessages = getMessages(chatMessages);
        setMessages(loadedMessages);

        if (isOpen) {
            lastSeenCountRef.current = loadedMessages.length;
            onUnreadChange?.(0);
        }
    }, [isOpen, chatMessages, onUnreadChange]);

    // Listen for new messages
    useEffect(() => {
        const observer = () => {
            const loadedMessages = getMessages(chatMessages);
            setMessages(loadedMessages);

            if (isOpen) {
                lastSeenCountRef.current = loadedMessages.length;
                onUnreadChange?.(0);
            } else {
                const unread = loadedMessages.length - lastSeenCountRef.current;
                onUnreadChange?.(Math.max(0, unread));
            }
        };

        chatMessages.observe(observer);
        return () => chatMessages.unobserve(observer);
    }, [chatMessages, isOpen, onUnreadChange]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = useCallback(() => {
        if (!inputValue.trim() || isSending) return;

        setIsSending(true);
        sendMessage(chatMessages, inputValue, userName, userColor);
        setInputValue("");
        setIsSending(false);
        inputRef.current?.focus();
    }, [inputValue, isSending, chatMessages, userName, userColor]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
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
                    "inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl",
                    // Desktop: side panel
                    "md:inset-y-0 md:right-0 md:left-auto md:w-96 md:max-h-none md:rounded-l-2xl md:rounded-tr-none",
                    "animate-in slide-in-from-bottom md:slide-in-from-right duration-300"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-bold text-surface-900 dark:text-white">
                                Chat
                            </h2>
                            <p className="text-sm text-surface-500 dark:text-gray-400">
                                {messages.length} message{messages.length !== 1 ? "s" : ""}
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

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                                <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-surface-600 dark:text-gray-400 font-medium">
                                No messages yet
                            </p>
                            <p className="text-sm text-surface-500 dark:text-gray-500 mt-1">
                                Start a conversation with collaborators
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-2",
                                    message.userName === userName && "flex-row-reverse"
                                )}
                            >
                                {/* Avatar */}
                                <div
                                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ backgroundColor: message.userColor }}
                                >
                                    {message.userName.charAt(0).toUpperCase()}
                                </div>

                                {/* Message Bubble */}
                                <div
                                    className={cn(
                                        "flex-1 max-w-[75%] rounded-2xl px-3 py-2",
                                        message.userName === userName
                                            ? "bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-br-md"
                                            : "bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white rounded-bl-md"
                                    )}
                                >
                                    <div className="flex items-baseline gap-2 mb-0.5">
                                        <span className={cn(
                                            "text-xs font-medium",
                                            message.userName === userName
                                                ? "text-white/80"
                                                : "text-surface-500 dark:text-gray-400"
                                        )}>
                                            {message.userName === userName ? "You" : message.userName}
                                        </span>
                                        <span className={cn(
                                            "text-xs",
                                            message.userName === userName
                                                ? "text-white/60"
                                                : "text-surface-400 dark:text-gray-500"
                                        )}>
                                            {formatChatTime(message.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-sm break-words whitespace-pre-wrap">
                                        {message.text}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className={cn(
                                "flex-1 px-4 py-3 rounded-xl border bg-white dark:bg-surface-800",
                                "text-surface-900 dark:text-white placeholder:text-surface-400",
                                "border-surface-200 dark:border-surface-700",
                                "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500",
                                "transition-all duration-200"
                            )}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isSending}
                            className={cn(
                                "px-4 py-3 rounded-xl font-semibold text-white",
                                "bg-gradient-to-r from-primary-500 to-purple-600",
                                "hover:shadow-lg hover:shadow-primary-500/30",
                                "transition-all duration-200",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/**
 * Chat utilities for real-time messaging
 */
import * as Y from "yjs";
import { nanoid } from "nanoid";

export interface ChatMessage {
    id: string;
    userId: string;
    userName: string;
    userColor: string;
    text: string;
    timestamp: number;
}

/**
 * Send a chat message
 */
export function sendMessage(
    messagesArray: Y.Array<ChatMessage>,
    text: string,
    userName: string,
    userColor: string
): ChatMessage {
    const message: ChatMessage = {
        id: nanoid(10),
        userId: nanoid(8),
        userName,
        userColor,
        text: text.trim(),
        timestamp: Date.now(),
    };

    messagesArray.push([message]);
    return message;
}

/**
 * Get all messages
 */
export function getMessages(messagesArray: Y.Array<ChatMessage>): ChatMessage[] {
    return messagesArray.toArray();
}

/**
 * Format timestamp for chat display
 */
export function formatChatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Get relative time (e.g., "2 min ago")
 */
export function getRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return formatChatTime(timestamp);
}

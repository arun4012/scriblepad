import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Custom alphabet for room IDs - URL-safe and easy to read
const nanoid = customAlphabet(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    8
);

/**
 * Generate a unique 8-character room ID
 */
export function generateRoomId(): string {
    return nanoid();
}

/**
 * Copy text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand("copy");
            textArea.remove();
            return success;
        }
    } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        return false;
    }
}

/**
 * Tailwind CSS class name utility - merges classes intelligently
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Download a file with the given content
 */
export function downloadFile(
    content: string,
    filename: string,
    mimeType: string = "text/plain"
): void {
    try {
        const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.style.display = 'none';
        link.href = url;
        link.download = filename;

        // Append to body
        document.body.appendChild(link);

        // Use setTimeout to ensure the link is in the DOM
        setTimeout(() => {
            link.click();

            // Cleanup after a short delay
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        }, 0);
    } catch (error) {
        console.error("Download failed:", error);

        // Fallback: open in new tab for user to save manually
        const dataUrl = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
        window.open(dataUrl, '_blank');
    }
}

/**
 * Format content as Markdown
 */
export function formatAsMarkdown(title: string, content: string): string {
    const lines = [`# ${title || "Untitled Note"}`, "", content];
    return lines.join("\n");
}

/**
 * Get the current room URL
 */
export function getRoomUrl(roomId: string): string {
    if (typeof window !== "undefined") {
        return `${window.location.origin}/r/${roomId}`;
    }
    return `/r/${roomId}`;
}

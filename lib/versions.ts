/**
 * Version history management for ScriblePad
 */
import * as Y from "yjs";
import { nanoid } from "nanoid";

export interface Version {
    id: string;
    timestamp: number;
    titleSnapshot: string;
    contentSnapshot: string;
}

const MAX_VERSIONS = 50;

/**
 * Capture current document state as a version
 */
export function captureVersion(
    titleText: Y.Text,
    contentText: Y.Text,
    versionsArray: Y.Array<Version>
): Version {
    const version: Version = {
        id: nanoid(10),
        timestamp: Date.now(),
        titleSnapshot: titleText.toString(),
        contentSnapshot: contentText.toString(),
    };

    // Add new version
    versionsArray.push([version]);

    // Prune old versions if exceeding limit
    while (versionsArray.length > MAX_VERSIONS) {
        versionsArray.delete(0, 1);
    }

    return version;
}

/**
 * Get all versions from the array
 */
export function getVersions(versionsArray: Y.Array<Version>): Version[] {
    return versionsArray.toArray();
}

/**
 * Restore a version by replacing current content
 */
export function restoreVersion(
    titleText: Y.Text,
    contentText: Y.Text,
    version: Version
): void {
    // Clear and set title
    titleText.delete(0, titleText.length);
    titleText.insert(0, version.titleSnapshot);

    // Clear and set content
    contentText.delete(0, contentText.length);
    contentText.insert(0, version.contentSnapshot);
}

/**
 * Format timestamp for display
 */
export function formatVersionTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (isToday) {
        return `Today at ${time}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${time}`;
    }

    return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

/**
 * Check if content has changed significantly (for auto-save)
 */
export function hasSignificantChange(
    currentTitle: string,
    currentContent: string,
    versions: Version[]
): boolean {
    if (versions.length === 0) {
        // Always save first version if there's content
        return currentTitle.length > 0 || currentContent.length > 10;
    }

    const lastVersion = versions[versions.length - 1];

    // Check if title changed
    if (currentTitle !== lastVersion.titleSnapshot) {
        return true;
    }

    // Check if content changed by more than 50 characters
    const contentDiff = Math.abs(currentContent.length - lastVersion.contentSnapshot.length);
    if (contentDiff > 50) {
        return true;
    }

    // Check if content is different (even if similar length)
    if (currentContent !== lastVersion.contentSnapshot && contentDiff > 10) {
        return true;
    }

    return false;
}

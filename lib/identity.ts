import randomColor from "randomcolor";

// Friendly adjectives and nouns for generating user names
const adjectives = [
    "Happy",
    "Clever",
    "Swift",
    "Gentle",
    "Brave",
    "Calm",
    "Eager",
    "Jolly",
    "Kind",
    "Lively",
    "Merry",
    "Noble",
    "Proud",
    "Quick",
    "Witty",
    "Zesty",
    "Cosmic",
    "Stellar",
    "Lunar",
    "Solar",
];

const nouns = [
    "Panda",
    "Eagle",
    "Tiger",
    "Dolphin",
    "Fox",
    "Wolf",
    "Bear",
    "Lion",
    "Hawk",
    "Owl",
    "Falcon",
    "Phoenix",
    "Dragon",
    "Unicorn",
    "Griffin",
    "Pegasus",
    "Comet",
    "Nebula",
    "Star",
    "Moon",
];

export interface UserIdentity {
    name: string;
    color: string;
}

/**
 * Generate a friendly random username like "HappyPanda" or "SwiftEagle"
 */
export function generateUserName(): string {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}${noun}`;
}

/**
 * Generate a unique vibrant color for the user
 */
export function generateUserColor(): string {
    return randomColor({
        luminosity: "bright",
        format: "hex",
    });
}

/**
 * Get or create a session-based identity.
 * Regenerates on each browser session for privacy.
 */
export function getOrCreateIdentity(): UserIdentity {
    // Check if we have an identity in sessionStorage
    if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("scriblepad-identity");
        if (stored) {
            try {
                return JSON.parse(stored) as UserIdentity;
            } catch {
                // Invalid stored data, regenerate
            }
        }

        // Generate new identity
        const identity: UserIdentity = {
            name: generateUserName(),
            color: generateUserColor(),
        };

        sessionStorage.setItem("scriblepad-identity", JSON.stringify(identity));
        return identity;
    }

    // Fallback for SSR
    return {
        name: generateUserName(),
        color: generateUserColor(),
    };
}

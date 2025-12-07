import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";
import { IndexeddbPersistence } from "y-indexeddb";
import type { UserIdentity } from "./identity";
import type { Version } from "./versions";
import type { ChatMessage } from "./chat";

// PartyKit host - will be set after deployment
// For local development, use localhost:1999
// For production, use your-project.username.partykit.dev
const PARTYKIT_HOST =
    process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

export interface YjsContext {
    doc: Y.Doc;
    provider: YPartyKitProvider;
    persistence: IndexeddbPersistence;
    titleText: Y.Text;
    contentText: Y.Text;
    metadataMap: Y.Map<string>;
    versionsArray: Y.Array<Version>;
    chatMessages: Y.Array<ChatMessage>;
    awareness: YPartyKitProvider["awareness"];
    destroy: () => void;
}

export interface AwarenessUser {
    name: string;
    color: string;
    clientId: number;
}

/**
 * Create a Yjs document with PartyKit provider and IndexedDB persistence
 */
export function createYjsContext(
    roomId: string,
    identity: UserIdentity
): YjsContext {
    // Create the Yjs document
    const doc = new Y.Doc();

    // Create shared text types for title and content
    const titleText = doc.getText("title");
    const contentText = doc.getText("content");

    // Create metadata map for password and settings
    const metadataMap = doc.getMap<string>("metadata");

    // Create versions array for version history
    const versionsArray = doc.getArray<Version>("versions");

    // Create chat messages array for real-time chat
    const chatMessages = doc.getArray<ChatMessage>("chatMessages");

    // Setup IndexedDB persistence for offline support (local cache)
    const persistence = new IndexeddbPersistence(`scriblepad-${roomId}`, doc);

    // Setup PartyKit provider for real-time sync AND cloud persistence
    const provider = new YPartyKitProvider(PARTYKIT_HOST, `scriblepad-${roomId}`, doc, {
        connect: true,
    });

    const awareness = provider.awareness;

    // Set local awareness state with user identity
    awareness.setLocalStateField("user", {
        name: identity.name,
        color: identity.color,
    });

    // Cleanup function
    const destroy = () => {
        awareness.setLocalState(null);
        provider.disconnect();
        provider.destroy();
        persistence.destroy();
        doc.destroy();
    };

    return {
        doc,
        provider,
        persistence,
        titleText,
        contentText,
        metadataMap,
        versionsArray,
        chatMessages,
        awareness,
        destroy,
    };
}


/**
 * Get all connected users from awareness
 */
export function getAwarenessUsers(
    awareness: YPartyKitProvider["awareness"]
): AwarenessUser[] {
    const users: AwarenessUser[] = [];

    awareness.getStates().forEach((state, clientId) => {
        if (state.user) {
            users.push({
                name: state.user.name,
                color: state.user.color,
                clientId,
            });
        }
    });

    return users;
}

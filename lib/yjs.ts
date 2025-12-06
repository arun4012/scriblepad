import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";
import type { UserIdentity } from "./identity";

export interface YjsContext {
    doc: Y.Doc;
    provider: WebrtcProvider;
    persistence: IndexeddbPersistence;
    titleText: Y.Text;
    contentText: Y.Text;
    awareness: WebrtcProvider["awareness"];
    destroy: () => void;
}

export interface AwarenessUser {
    name: string;
    color: string;
    clientId: number;
}

/**
 * Create a Yjs document with WebRTC provider and IndexedDB persistence
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

    // Setup IndexedDB persistence for offline support
    const persistence = new IndexeddbPersistence(`scriblepad-${roomId}`, doc);

    // Setup WebRTC provider for P2P sync
    // Using public signaling servers - you can host your own for production
    const provider = new WebrtcProvider(`scriblepad-${roomId}`, doc, {
        signaling: [
            "wss://signaling.yjs.dev",
            "wss://y-webrtc-signaling-eu.herokuapp.com",
            "wss://y-webrtc-signaling-us.herokuapp.com",
        ],
        password: null,
        awareness: new Y.Doc().getMap().doc!.awareness as never,
        maxConns: 20,
        filterBcConns: true,
        peerOpts: {},
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
        awareness,
        destroy,
    };
}

/**
 * Get all connected users from awareness
 */
export function getAwarenessUsers(
    awareness: WebrtcProvider["awareness"]
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

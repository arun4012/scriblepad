import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

export default class YjsServer implements Party.Server {
    constructor(readonly room: Party.Room) { }

    onConnect(conn: Party.Connection) {
        // Use y-partykit's onConnect handler for Yjs synchronization
        // This handles all Yjs document sync and persistence automatically
        return onConnect(conn, this.room, {
            persist: { mode: "snapshot" }, // Persist document state
        });
    }
}

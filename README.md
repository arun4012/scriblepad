# ScriblePad

**Real-time Collaborative Notes App** - Create and share notes instantly with P2P synchronization.

![ScriblePad](./public/icon.svg)

## ✨ Features

- **No Login Required** - Just create a pad and share the link
- **Real-time Sync** - P2P WebRTC-based synchronization using Yjs CRDT
- **Offline Support** - Notes are saved locally with IndexedDB
- **Presence Awareness** - See who's collaborating with you
- **Export Options** - Download notes as `.txt` or `.md`
- **Mobile Friendly** - Fully responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/scriblepad.git
cd scriblepad

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **CRDT Engine**: [Yjs](https://yjs.dev/)
- **P2P Sync**: [y-webrtc](https://github.com/yjs/y-webrtc)
- **Local Storage**: [y-indexeddb](https://github.com/yjs/y-indexeddb)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Browser Client                  │
├─────────────────────────────────────────────────┤
│  React Components                               │
│  ├── Editor (collaborative textarea)            │
│  ├── PresenceBar (connected users)              │
│  └── Controls (share, export)                   │
├─────────────────────────────────────────────────┤
│  Yjs Document                                   │
│  ├── Y.Text (title)                             │
│  └── Y.Text (content)                           │
├─────────────────────────────────────────────────┤
│  Providers                                      │
│  ├── y-indexeddb (local persistence)            │
│  └── y-webrtc (P2P sync)                        │
└─────────────────────────────────────────────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │   Signaling Server  │
           │  (wss://yjs.dev)    │
           └─────────────────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │   Other Clients     │
           │   (P2P via WebRTC)  │
           └─────────────────────┘
```

## 📁 Project Structure

```
scriblepad/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── r/
│       └── [roomId]/
│           └── page.tsx     # Room page
├── components/
│   ├── Controls.tsx         # Action buttons
│   ├── Editor.tsx           # Collaborative editor
│   ├── PresenceBar.tsx      # User presence
│   └── Toast.tsx            # Notifications
├── lib/
│   ├── identity.ts          # User identity
│   ├── utils.ts             # Utility functions
│   └── yjs.ts               # Yjs setup
└── public/
    ├── icon.svg             # App icon
    └── manifest.json        # PWA manifest
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/scriblepad)

Or deploy manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## ⚠️ Known Limitations

### WebRTC P2P Constraints

1. **Initial Connection** - Requires at least one user online for sync
2. **NAT Traversal** - May fail behind strict corporate firewalls
3. **No Server Persistence** - Data only exists on connected clients
4. **Scalability** - P2P mesh doesn't scale well beyond ~20 users per room

### For Production Use

Consider upgrading to a hosted backend:

- [Liveblocks](https://liveblocks.io/) - Managed Yjs infrastructure
- [PartyKit](https://partykit.io/) - Serverless WebSocket rooms
- [Hocuspocus](https://tiptap.dev/hocuspocus) - Self-hosted Yjs backend
- [y-websocket](https://github.com/yjs/y-websocket) - Self-hosted WebSocket server

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with 💜 by the ScriblePad team

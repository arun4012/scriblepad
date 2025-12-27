# ScriblePad

**Real-time Collaborative Notes App** — Create and share notes instantly with cloud sync and persistence.

![ScriblePad](./public/favicon.png)

## ✨ Features

- 🚀 **No Login Required** — Just create a pad and share the link
- ⚡ **Real-time Sync** — Instant synchronization using Yjs CRDT + PartyKit
- 💾 **Cloud Persistence** — Notes persist across devices and browsers
- 📴 **Offline Support** — Local IndexedDB caching for offline editing
- 👥 **Presence Awareness** — See who's collaborating with you in real-time
- 💬 **Real-time Chat** — Chat with collaborators directly in the pad
- 🔒 **Password Protection** — Optionally protect pads with a password
- 📜 **Version History** — View and restore previous versions of notes
- 📤 **Export Options** — Download notes as `.txt` or `.md`
- 📱 **Mobile Friendly** — Fully responsive, touch-optimized design
- 🎨 **Modern UI** — Clean "Ink & Paper" design, dark mode support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PartyKit account (free) for cloud sync

### Installation

```bash
# Clone the repository
git clone https://github.com/arun4012/scriblepad.git
cd scriblepad

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Local Development

You need to run **two servers** — Next.js for the frontend and PartyKit for real-time sync:

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2: Start PartyKit dev server
npm run dev:party
```

Or run both together:

```bash
npm run dev:all
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Yjs](https://yjs.dev/) | CRDT engine for conflict-free editing |
| [PartyKit](https://partykit.io/) | Real-time sync + cloud persistence |
| [y-partykit](https://github.com/partykit/y-partykit) | Yjs ↔ PartyKit integration |
| [y-indexeddb](https://github.com/yjs/y-indexeddb) | Local offline storage |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser Client                     │
├─────────────────────────────────────────────────────┤
│  React Components                                    │
│  ├── Editor (collaborative textarea)                 │
│  ├── PresenceBar (connected users)                   │
│  └── Controls (share, export)                        │
├─────────────────────────────────────────────────────┤
│  Yjs Document                                        │
│  ├── Y.Text (title)                                  │
│  └── Y.Text (content)                                │
├─────────────────────────────────────────────────────┤
│  Providers                                           │
│  ├── y-indexeddb (local cache)                       │
│  └── y-partykit (cloud sync + persistence)           │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
           ┌──────────────────────────┐
           │   PartyKit Cloud Server   │
           │  (scriblepad.*.partykit)  │
           │                          │
           │  • WebSocket connections  │
           │  • Document persistence   │
           │  • Presence awareness     │
           └──────────────────────────┘
                        │
                        ▼
           ┌──────────────────────────┐
           │     Other Clients         │
           │  (real-time sync)         │
           └──────────────────────────┘
```

## 📁 Project Structure

```
scriblepad/
├── app/
│   ├── globals.css          # Global styles & design tokens
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Landing page
│   ├── robots.ts            # SEO robots configuration
│   └── r/
│       └── [roomId]/
│           └── page.tsx     # Collaborative room page
├── components/
│   ├── Controls.tsx         # Share, export, copy buttons
│   ├── Editor.tsx           # Collaborative text editor
│   ├── PresenceBar.tsx      # Online user indicators
│   └── Toast.tsx            # Notification system
├── lib/
│   ├── identity.ts          # User identity management
│   ├── utils.ts             # Utility functions
│   └── yjs.ts               # Yjs + PartyKit setup
├── party/
│   └── index.ts             # PartyKit server (Yjs sync)
├── public/
│   ├── favicon.png          # App icon (512x512)
│   └── manifest.json        # PWA manifest
├── .env.example             # Environment variables template
├── partykit.json            # PartyKit configuration
└── package.json             # Dependencies & scripts
```

## 🌐 Deployment

### Step 1: Deploy PartyKit Server

```bash
# Login to PartyKit (one-time)
npx partykit login

# Deploy the server
npm run party:deploy
```

This gives you a URL like: `scriblepad.your-username.partykit.dev`

### Step 2: Deploy to Vercel

1. **Set Environment Variable in Vercel:**
   - Go to your Vercel project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_PARTYKIT_HOST` = `scriblepad.your-username.partykit.dev`

2. **Deploy:**
   ```bash
   git push  # Auto-deploys if connected to Vercel
   ```

   Or deploy manually:
   ```bash
   vercel
   ```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_PARTYKIT_HOST` | PartyKit server URL | `scriblepad.arun4012.partykit.dev` |

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run dev:party` | Start PartyKit dev server (port 1999) |
| `npm run dev:all` | Run both servers concurrently |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run party:deploy` | Deploy PartyKit to production |

## 🔧 How It Works

### Real-time Collaboration

1. **User creates a pad** → Generates unique room ID
2. **Yjs document created** → Contains title and content as `Y.Text`
3. **PartyKit provider connects** → Syncs document to cloud
4. **IndexedDB caches locally** → Enables offline editing
5. **Share link** → Other users join and sync instantly

### Conflict Resolution

ScriblePad uses **Yjs CRDT** (Conflict-free Replicated Data Type):
- No central authority needed
- Automatic merge of concurrent edits
- Works offline, syncs when reconnected
- Guaranteed eventual consistency

### Persistence

| Layer | Storage | Purpose |
|-------|---------|---------|
| **PartyKit** | Cloud (Durable Objects) | Cross-device sync, permanent storage |
| **IndexedDB** | Browser | Offline cache, instant load |

## 📱 PWA Support

ScriblePad works as a Progressive Web App:
- **Installable** on mobile and desktop
- **Offline capable** with local caching
- **Fast loading** with Next.js optimization

## 🎨 Design System

The UI uses an **"Ink & Paper"** design language:
- **Color palette** — Electric Indigo (#4F46E5) primary, Ink/Paper surfaces
- **Clean surfaces** — Paper-white cards with subtle micro-shadows
- **Minimal animations** — Subtle fades and transitions
- **Dark mode** support with Ink-900 (#0F172A) backgrounds
- **Responsive typography** — Inter font family with fluid sizing
- **Touch-optimized** targets (44px minimum)

See `app/globals.css` and `tailwind.config.ts` for customization.

## 🔒 Privacy & Security

- **No accounts required** — Anonymous by design
- **Room IDs are random** — 21-character nanoid
- **No tracking** — No analytics or cookies
- **Data ownership** — You control your notes

> ⚠️ **Note:** Anyone with the room link can view and edit the note. Don't share sensitive information.

## 📊 Performance

| Metric | Value |
|--------|-------|
| Initial load | < 2 seconds |
| Editor ready | Instant (no blocking sync) |
| Real-time latency | ~50-100ms (depends on network) |
| Offline → Online sync | Automatic |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License — feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Yjs](https://yjs.dev/) — Amazing CRDT implementation
- [PartyKit](https://partykit.io/) — Fantastic real-time infrastructure
- [Next.js](https://nextjs.org/) — Best React framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS

---

Built with 💙 by [Arun](https://github.com/arun4012)

**Live Demo:** [scriblepad.vercel.app](https://scriblepad.vercel.app)

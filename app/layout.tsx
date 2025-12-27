import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scriblepad.vercel.app';

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
        { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: "Online Notepad - ScriblePad | Real-time Collaborative Notes",
    description:
        "Free online notepad for quick notes and real-time collaboration. No login required. Create, share, and edit notes instantly with anyone. Works offline.",
    keywords: [
        // Primary keywords
        "online notepad",
        "free online notepad",
        "notepad online",
        "online text editor",
        "free text editor",
        "quick notes online",
        "write notes online",
        // Collaboration keywords
        "collaborative notes",
        "real-time collaboration",
        "shared notepad",
        "team notes",
        "collaborative editing",
        "live text editor",
        // Feature keywords
        "no login notepad",
        "no signup notes",
        "instant notes",
        "notes without registration",
        "anonymous notepad",
        "private notepad",
        "secure notes",
        "offline notes",
        // Use case keywords
        "scratch pad",
        "quick note taking",
        "paste text online",
        "temporary notes",
        "shareable notes",
        "simple notepad",
        "minimalist notes",
        // Alternative names
        "web notepad",
        "browser notepad",
        "cloud notepad",
        "digital notepad",
        "virtual notepad",
    ],
    authors: [{ name: "ScriblePad" }],
    creator: "ScriblePad",
    publisher: "ScriblePad",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: "Online Notepad - ScriblePad | Real-time Collaborative Notes",
        description:
            "Free online notepad for quick notes and real-time collaboration. No login required. Create, share, and edit notes instantly with anyone.",
        type: "website",
        siteName: "ScriblePad",
        url: BASE_URL,
        locale: 'en_US',
    },
    twitter: {
        card: "summary_large_image",
        title: "Online Notepad - ScriblePad | Real-time Collaborative Notes",
        description:
            "Free online notepad for quick notes and real-time collaboration. No login required. Create, share, and edit notes instantly with anyone.",
    },
    alternates: {
        canonical: BASE_URL,
    },
    verification: {
        google: 'LCdekK0sRF2h_Ekytu5G9WeWqBtsyvoDygeaLESC5Hs',
    },

};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.png" type="image/png" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className="min-h-screen bg-paper-100 dark:bg-ink-900 text-ink-900 dark:text-white antialiased">
                {children}
            </body>
        </html>
    );
}

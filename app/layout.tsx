import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "ScriblePad - Real-time Collaborative Notes",
    description:
        "Create and share notes instantly. No login required. Real-time P2P collaboration with offline support.",
    keywords: [
        "notes",
        "collaboration",
        "real-time",
        "P2P",
        "WebRTC",
        "offline",
        "free",
    ],
    authors: [{ name: "ScriblePad" }],
    openGraph: {
        title: "ScriblePad - Real-time Collaborative Notes",
        description:
            "Create and share notes instantly. No login required. Real-time P2P collaboration with offline support.",
        type: "website",
        siteName: "ScriblePad",
    },
    twitter: {
        card: "summary_large_image",
        title: "ScriblePad - Real-time Collaborative Notes",
        description:
            "Create and share notes instantly. No login required. Real-time P2P collaboration with offline support.",
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
    },
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link
                    rel="icon"
                    href="/icon.svg"
                    type="image/svg+xml"
                />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-gray-900 dark:text-white antialiased">
                <div className="fixed inset-0 -z-10 overflow-hidden">
                    {/* Decorative background orbs */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
                </div>
                {children}
            </body>
        </html>
    );
}

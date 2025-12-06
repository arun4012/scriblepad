"use client";

import { useRouter } from "next/navigation";
import { generateRoomId } from "@/lib/utils";

export default function HomePage() {
    const router = useRouter();

    const handleCreatePad = () => {
        const roomId = generateRoomId();
        router.push(`/r/${roomId}`);
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 page-enter">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto">
                {/* Logo */}
                <div className="mb-8 float">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                    <span className="gradient-text">ScriblePad</span>
                </h1>

                {/* Tagline */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 text-balance">
                    Real-time collaborative notes.{" "}
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                        No login required.
                    </span>
                </p>

                <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
                    Create a pad, share the link, and start collaborating instantly.
                    Your notes sync in real-time with everyone who has the link.
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleCreatePad}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-lg font-semibold rounded-xl transition-all duration-300 hover-lift shadow-lg shadow-primary-500/30"
                >
                    <svg
                        className="w-6 h-6 transition-transform group-hover:rotate-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    Create New Pad
                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Features */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        }
                        title="Real-time Sync"
                        description="Changes sync instantly between all connected users via P2P WebRTC."
                    />
                    <FeatureCard
                        icon={
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                            </svg>
                        }
                        title="Offline Support"
                        description="Notes are saved locally. Continue editing even without internet."
                    />
                    <FeatureCard
                        icon={
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        }
                        title="No Login Needed"
                        description="Just share the link. Anyone with the link can join and collaborate."
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-24 text-center text-sm text-gray-400 dark:text-gray-500">
                <p>
                    Built with 💜 using{" "}
                    <a
                        href="https://nextjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:underline"
                    >
                        Next.js
                    </a>
                    ,{" "}
                    <a
                        href="https://yjs.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:underline"
                    >
                        Yjs
                    </a>
                    , and{" "}
                    <a
                        href="https://github.com/yjs/y-webrtc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:underline"
                    >
                        WebRTC
                    </a>
                </p>
            </footer>
        </main>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="glass-card p-6 rounded-2xl text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
        </div>
    );
}

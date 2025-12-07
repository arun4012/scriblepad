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
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 page-enter ambient-bg relative overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -z-10 animate-pulse-soft" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl -z-10 animate-pulse-soft" />
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl -z-10" />

            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto relative z-10">
                {/* Logo */}
                <div className="mb-10 float">
                    <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 shadow-glow-lg pulse-glow">
                        <svg
                            className="w-12 h-12 md:w-14 md:h-14 text-white drop-shadow-lg"
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
                <h1 className="text-responsive-xl font-extrabold mb-6 tracking-tight">
                    <span className="gradient-text">ScriblePad</span>
                </h1>

                {/* Tagline */}
                <p className="text-responsive-lg text-surface-700 dark:text-gray-300 mb-4 text-balance font-medium">
                    Real-time collaborative notes.{" "}
                    <span className="bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent font-bold">
                        No login required.
                    </span>
                </p>

                <p className="text-lg md:text-xl text-surface-700/70 dark:text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
                    Create a pad, share the link, and start collaborating instantly.
                    Your notes sync in real-time with everyone who has the link.
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleCreatePad}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 text-white text-lg md:text-xl font-bold rounded-2xl transition-all duration-300 hover-lift btn-primary touch-target"
                >
                    <svg
                        className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:rotate-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    Create New Pad
                </button>

                {/* Features */}
                <div className="mt-20 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
                        description="Changes sync instantly between all connected users via PartyKit."
                        gradient="from-primary-500 to-purple-500"
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
                        gradient="from-accent-500 to-amber-500"
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
                        gradient="from-emerald-500 to-teal-500"
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-24 text-center text-sm text-surface-700/50 dark:text-gray-500">
                <p>
                    Built with 💜 using{" "}
                    <a
                        href="https://nextjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                    >
                        Next.js
                    </a>
                    ,{" "}
                    <a
                        href="https://yjs.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                    >
                        Yjs
                    </a>
                    , and{" "}
                    <a
                        href="https://partykit.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                    >
                        PartyKit
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
    gradient,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}) {
    return (
        <div className="glass-card feature-card p-6 md:p-8 rounded-2xl md:rounded-3xl text-center">
            <div className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${gradient} text-white mb-5 shadow-lg`}>
                {icon}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-surface-900 dark:text-white mb-3">
                {title}
            </h3>
            <p className="text-surface-700/70 dark:text-gray-400 text-sm md:text-base leading-relaxed">{description}</p>
        </div>
    );
}

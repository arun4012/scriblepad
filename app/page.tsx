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
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 page-enter relative overflow-hidden">
            {/* 3D Background Image */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-20 scale-110"
                    style={{ backgroundImage: 'url(/bg-3d.png)' }}
                />

                {/* Overlay gradient to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/60 dark:from-ink-900/40 dark:via-ink-900/20 dark:to-ink-900/80" />
            </div>

            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto relative z-10">
                {/* Logo */}
                <div className="mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary-600 shadow-soft-lg">
                        <svg
                            className="w-10 h-10 md:w-12 md:h-12 text-white"
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
                <h1 className="text-responsive-xl font-extrabold mb-6 tracking-tight text-ink-900 dark:text-white">
                    ScriblePad
                </h1>

                {/* Tagline */}
                <p className="text-responsive-lg text-ink-600 dark:text-ink-300 mb-4 text-balance font-medium">
                    Real-time collaborative notes.{" "}
                    <span className="text-primary-600 dark:text-primary-400 font-bold">
                        No login required.
                    </span>
                </p>

                <p className="text-lg md:text-xl text-ink-500 dark:text-ink-400 mb-12 max-w-xl mx-auto leading-relaxed">
                    Create a pad, share the link, and start collaborating instantly.
                    Your notes sync in real-time with everyone who has the link.
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleCreatePad}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 text-white text-lg md:text-xl font-bold rounded-2xl transition-all duration-200 btn-primary touch-target"
                >
                    <svg
                        className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-200 group-hover:rotate-90"
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
                        iconBg="bg-primary-100 dark:bg-primary-900/30"
                        iconColor="text-primary-600 dark:text-primary-400"
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
                        iconBg="bg-amber-100 dark:bg-amber-900/30"
                        iconColor="text-amber-600 dark:text-amber-400"
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
                        iconBg="bg-emerald-100 dark:bg-emerald-900/30"
                        iconColor="text-emerald-600 dark:text-emerald-400"
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-24 text-center text-sm text-ink-400 dark:text-ink-500">
                <p>
                    Built with{" "}
                    <a
                        href="https://nextjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors font-medium"
                    >
                        Next.js
                    </a>
                    ,{" "}
                    <a
                        href="https://yjs.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors font-medium"
                    >
                        Yjs
                    </a>
                    , and{" "}
                    <a
                        href="https://partykit.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors font-medium"
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
    iconBg,
    iconColor,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <div className="card-paper feature-card p-6 md:p-8 text-center">
            <div className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl ${iconBg} ${iconColor} mb-5`}>
                {icon}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-ink-900 dark:text-white mb-3">
                {title}
            </h3>
            <p className="text-ink-500 dark:text-ink-400 text-sm md:text-base leading-relaxed">{description}</p>
        </div>
    );
}

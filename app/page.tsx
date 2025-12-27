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
        <main className="min-h-screen flex flex-col items-center justify-start pt-24 pb-16 px-4 page-enter relative overflow-hidden">
            {/* Dynamic Grid Background */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
                />
                <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] dark:[mask-image:linear-gradient(to_bottom,black,transparent)]" />

                {/* Ambient Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-200/20 dark:bg-primary-900/20 blur-[100px] rounded-full mix-blend-screen dark:mix-blend-lighten pointer-events-none" />
            </div>

            {/* Hero Section */}
            <div className="text-center max-w-5xl mx-auto relative z-10 flex flex-col items-center">

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-ink-900 dark:text-white mb-6 text-balance leading-[1.1] animate-fade-in-up delay-100">
                    Collaborative notes for <br className="hidden md:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
                        modern teams.
                    </span>
                </h1>

                {/* Tagline */}
                <p className="text-xl md:text-2xl text-ink-600 dark:text-ink-300 mb-10 max-w-2xl mx-auto leading-relaxed text-balance animate-fade-in-up delay-200">
                    The fastest way to capture ideas and share them with anyone. <br className="hidden md:block" />
                    Real-time sync. Offline ready. <span className="text-primary-600 dark:text-primary-400 font-bold">No login required.</span>
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up delay-300">
                    <button
                        onClick={handleCreatePad}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-white text-lg font-bold rounded-xl transition-all duration-200 btn-primary shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Start Writing Now
                    </button>
                </div>

                {/* App Preview Mockup */}
                <div className="relative w-full max-w-4xl mx-auto perspective-1000 animate-float-slow">
                    {/* Glow behind mockup */}
                    <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-none transform scale-95" />

                    {/* The Mockup Card */}
                    <div className="relative bg-white/80 dark:bg-ink-900/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-ink-700/50 shadow-2xl overflow-hidden transform rotate-x-12 transition-transform duration-500 hover:rotate-x-0">
                        {/* Fake Toolbar */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-100 dark:border-ink-800 bg-white/50 dark:bg-ink-900/50">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 text-center">
                                <div className="inline-block px-3 py-1 bg-ink-100 dark:bg-ink-800 rounded-md text-xs font-medium text-ink-500 dark:text-ink-400">
                                    scriblepad.com
                                </div>
                            </div>
                            <div className="w-16" /> {/* Spacer for balance */}
                        </div>

                        {/* Fake Editor Content */}
                        <div className="p-8 text-left h-[300px] md:h-[400px] overflow-hidden bg-white dark:bg-ink-950 relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <svg className="w-32 h-32 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01747L14.017 21ZM16.017 21H17.017C18.1216 21 19.017 20.1046 19.017 19V5C19.017 3.89543 18.1216 3 17.017 3H7.01747C5.9129 3 5.01747 3.89543 5.01747 5V19C5.01747 20.1046 5.9129 21 7.01747 21H12.017V19H12.0183L12.017 18V18.9967L12.0183 19H12.017V21H16.017ZM15.017 7H9.01747V9H15.017V7ZM15.017 11H9.01747V13H15.017V11Z" />
                                </svg>
                            </div>

                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-ink-100 dark:bg-ink-800 rounded w-1/3 mb-8" />
                                <div className="space-y-3">
                                    <div className="h-4 bg-ink-50 dark:bg-ink-800/50 rounded w-full" />
                                    <div className="h-4 bg-ink-50 dark:bg-ink-800/50 rounded w-11/12" />
                                    <div className="h-4 bg-ink-50 dark:bg-ink-800/50 rounded w-4/5" />
                                    <div className="h-4 bg-ink-50 dark:bg-ink-800/50 rounded w-full" />
                                </div>
                                <div className="space-y-3 pt-4">
                                    <div className="h-4 bg-ink-50 dark:bg-ink-800/50 rounded w-11/12" />
                                    <div className="h-4 bg-ink-50 dark:bg-ink-800/50 rounded w-full" />
                                    <div className="h-4 bg-ink-50 dark:bg-ink-800/50 rounded w-3/4" />
                                </div>
                            </div>

                            {/* Cursor */}
                            <div className="absolute top-[160px] left-[40%] w-0.5 h-5 bg-primary-500 animate-blink" />
                        </div>
                    </div>
                </div>

                {/* Features Grid - Minimal */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    <FeatureCard
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        }
                        title="Instant Sync"
                        description="Changes reflect immediately across all devices with sub-millisecond latency."
                    />
                    <FeatureCard
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        }
                        title="Private & Secure"
                        description="End-to-end optional password protection for your sensitive documents."
                    />
                    <FeatureCard
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        }
                        title="Export Anywhere"
                        description="Download your notes as Markdown or plain text with a single click."
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-24 pb-8 text-center text-sm text-ink-400 dark:text-ink-600 font-medium">
                <p>
                    © {new Date().getFullYear()} ScriblePad. Open source and free forever.
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
        <div className="p-8 rounded-2xl bg-white/50 dark:bg-ink-800/30 border border-ink-100 dark:border-ink-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors text-left group">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-ink-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-ink-500 dark:text-ink-400 text-sm leading-relaxed text-balance">
                {description}
            </p>
        </div>
    );
}

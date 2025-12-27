"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PasswordModalProps {
    mode: "set" | "unlock" | "remove";
    onSubmit: (password: string) => void;
    onClose: () => void;
    error?: string;
    isLoading?: boolean;
}

export function PasswordModal({
    mode,
    onSubmit,
    onClose,
    error,
    isLoading = false,
}: PasswordModalProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");

        if (!password.trim()) {
            setLocalError("Please enter a password");
            return;
        }

        if (mode === "set" && password.length < 4) {
            setLocalError("Password must be at least 4 characters");
            return;
        }

        if (mode === "set" && password !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        onSubmit(password);
    };

    const getTitle = () => {
        switch (mode) {
            case "set":
                return "Set Password";
            case "unlock":
                return "Enter Password";
            case "remove":
                return "Remove Password";
        }
    };

    const getDescription = () => {
        switch (mode) {
            case "set":
                return "Protect this pad with a password. Anyone with the link will need this password to view or edit.";
            case "unlock":
                return "This pad is password protected. Enter the password to continue.";
            case "remove":
                return "Enter the current password to remove protection.";
        }
    };

    const displayError = error || localError;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={mode !== "unlock" ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white dark:bg-ink-800 rounded-2xl p-6 md:p-8 shadow-soft-xl border border-paper-300 dark:border-ink-700 animate-in fade-in zoom-in-95 duration-200">
                {/* Close button (not shown for unlock mode) */}
                {mode !== "unlock" && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-ink-400 hover:text-ink-600 dark:text-ink-500 dark:hover:text-ink-300 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center",
                        mode === "unlock"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                            : "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    )}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={mode === "unlock"
                                    ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    : "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                }
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold text-center text-ink-900 dark:text-white mb-2">
                    {getTitle()}
                </h2>

                {/* Description */}
                <p className="text-center text-ink-500 dark:text-ink-400 mb-6 text-sm">
                    {getDescription()}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
                            Password
                        </label>
                        <input
                            ref={inputRef}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cn(
                                "w-full px-4 py-3 rounded-xl border bg-white dark:bg-ink-900",
                                "text-ink-900 dark:text-white placeholder:text-ink-400",
                                "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                                "transition-all duration-200",
                                displayError
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-paper-300 dark:border-ink-700 focus:border-primary-500"
                            )}
                            placeholder="Enter password"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Confirm Password (only for set mode) */}
                    {mode === "set" && (
                        <div>
                            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={cn(
                                    "w-full px-4 py-3 rounded-xl border bg-white dark:bg-ink-900",
                                    "text-ink-900 dark:text-white placeholder:text-ink-400",
                                    "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                                    "transition-all duration-200",
                                    displayError && localError.includes("match")
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-paper-300 dark:border-ink-700 focus:border-primary-500"
                                )}
                                placeholder="Confirm password"
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {/* Error Message */}
                    {displayError && (
                        <p className="text-sm text-red-500 flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {displayError}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                            "w-full py-3 px-4 rounded-xl font-semibold text-white",
                            "bg-primary-600 hover:bg-primary-700",
                            "shadow-soft hover:shadow-soft-md",
                            "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                            "transition-all duration-200",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            <>
                                {mode === "set" && "Set Password"}
                                {mode === "unlock" && "Unlock"}
                                {mode === "remove" && "Remove Password"}
                            </>
                        )}
                    </button>

                    {/* Cancel button for non-unlock modes */}
                    {mode !== "unlock" && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 px-4 rounded-xl font-medium text-ink-600 dark:text-ink-400 hover:bg-paper-200 dark:hover:bg-ink-700 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import * as Y from "yjs";
import { cn } from "@/lib/utils";

interface EditorProps {
    yText: Y.Text;
    placeholder?: string;
    className?: string;
    isTitle?: boolean;
    showCharCount?: boolean;
    maxLength?: number;
}

export function Editor({
    yText,
    placeholder = "Start typing...",
    className,
    isTitle = false,
    showCharCount = false,
    maxLength,
}: EditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const isUpdatingRef = useRef(false);
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [charCount, setCharCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);

    // Update character and word count
    const updateCharCount = useCallback(() => {
        const text = yText.toString();
        setCharCount(text.length);
        // Count words (split by whitespace, filter empty strings)
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
    }, [yText]);

    // Sync Yjs text to textarea
    const syncFromYjs = useCallback(() => {
        if (textareaRef.current && !isUpdatingRef.current) {
            const currentValue = textareaRef.current.value;
            const yjsValue = yText.toString();

            if (currentValue !== yjsValue) {
                // Preserve cursor position
                const selectionStart = textareaRef.current.selectionStart;
                const selectionEnd = textareaRef.current.selectionEnd;

                textareaRef.current.value = yjsValue;

                // Restore cursor position (clamped to new length)
                const newLength = yjsValue.length;
                textareaRef.current.selectionStart = Math.min(selectionStart, newLength);
                textareaRef.current.selectionEnd = Math.min(selectionEnd, newLength);
            }
        }
        updateCharCount();
    }, [yText, updateCharCount]);

    // Initialize and observe Yjs changes
    useEffect(() => {
        // Initial sync
        if (textareaRef.current) {
            textareaRef.current.value = yText.toString();
        }
        updateCharCount();

        // Observe external changes
        const observer = () => {
            syncFromYjs();
        };

        yText.observe(observer);

        return () => {
            yText.unobserve(observer);
        };
    }, [yText, syncFromYjs, updateCharCount]);

    // Handle local changes
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            let newValue = e.target.value;
            const oldValue = yText.toString();

            // Enforce maxLength if specified
            if (maxLength && newValue.length > maxLength) {
                newValue = newValue.slice(0, maxLength);
                e.target.value = newValue; // Update the textarea
            }

            if (newValue === oldValue) return;

            isUpdatingRef.current = true;

            // Use a transaction for atomic updates
            yText.doc?.transact(() => {
                // Simple diff: delete all and insert new
                // For a production app, you'd want a proper diff algorithm
                if (oldValue.length > 0) {
                    yText.delete(0, oldValue.length);
                }
                if (newValue.length > 0) {
                    yText.insert(0, newValue);
                }
            });

            isUpdatingRef.current = false;
            updateCharCount();
        },
        [yText, updateCharCount, maxLength]
    );

    // Track last known height to detect when resize is needed
    const lastHeightRef = useRef<number>(300);

    // Resize handler - fully synchronous to prevent any scroll jumps
    const handleResize = useCallback(() => {
        const textarea = textareaRef.current;
        const measureDiv = measureRef.current;
        if (textarea && measureDiv && !isTitle) {
            // Clear any pending resize
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
                resizeTimeoutRef.current = null;
            }

            const currentHeight = textarea.offsetHeight;
            const minHeight = 300;

            // Copy content to hidden div to measure true height
            measureDiv.textContent = textarea.value + '\n';
            const contentHeight = measureDiv.scrollHeight;
            const targetHeight = Math.max(contentHeight, minHeight);

            // Only update if there's a meaningful difference
            if (Math.abs(currentHeight - targetHeight) > 2) {
                // Capture state RIGHT BEFORE making any DOM changes
                const scrollYBefore = window.scrollY;
                const selStart = textarea.selectionStart;
                const selEnd = textarea.selectionEnd;
                const isAtEnd = selEnd >= textarea.value.length - 5;
                const isExpanding = targetHeight > currentHeight;
                const heightDelta = targetHeight - currentHeight;

                // Apply new height
                textarea.style.height = `${targetHeight}px`;
                lastHeightRef.current = targetHeight;

                // IMMEDIATELY restore scroll position (no setTimeout, no RAF)
                if (isExpanding) {
                    if (isAtEnd) {
                        // Typing at end - scroll down to show new content
                        window.scrollTo(0, scrollYBefore + heightDelta);
                    } else {
                        // Typing in middle - keep viewport stable
                        window.scrollTo(0, scrollYBefore);
                    }
                } else {
                    // Shrinking - make sure we don't scroll past new document end
                    const maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
                    window.scrollTo(0, Math.min(scrollYBefore, maxScroll));
                }

                // Restore cursor
                textarea.selectionStart = selStart;
                textarea.selectionEnd = selEnd;
            }
        }
    }, [isTitle]);

    // Handle paste - scroll to end of content after paste
    const handlePaste = useCallback(() => {
        // Cancel any pending debounced shrink that would restore scroll
        if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
        }

        // Function to scroll to bottom
        const scrollToBottom = () => {
            const textarea = textareaRef.current;
            if (textarea) {
                // Resize textarea to fit content
                if (textarea.scrollHeight > textarea.offsetHeight) {
                    textarea.style.height = `${textarea.scrollHeight}px`;
                }

                // Move cursor to end
                textarea.selectionStart = textarea.value.length;
                textarea.selectionEnd = textarea.value.length;

                // Focus the textarea
                textarea.focus();

                // Get the parent container and scroll it into view
                const container = textarea.closest('.relative');
                if (container) {
                    // Create a temporary element at the bottom to scroll to
                    const scrollTarget = document.createElement('div');
                    container.appendChild(scrollTarget);
                    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    container.removeChild(scrollTarget);
                } else {
                    // Fallback: scroll to bottom of page
                    window.scrollTo(0, document.body.scrollHeight);
                }
            }
        };

        // Multiple attempts to ensure scroll happens after all processing
        setTimeout(scrollToBottom, 100);
        setTimeout(scrollToBottom, 500);
        setTimeout(scrollToBottom, 1000);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, []);

    // Track scroll position to show/hide scroll-to-bottom button
    useEffect(() => {
        if (isTitle) return;

        const checkScrollPosition = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.scrollHeight;
            const distanceFromBottom = documentHeight - (scrollY + windowHeight);

            // Show scroll-to-bottom button if more than 150px from bottom and content is scrollable
            const shouldShowBottom = distanceFromBottom > 150 && documentHeight > windowHeight + 50;
            setShowScrollButton(shouldShowBottom);

            // Show scroll-to-top button if scrolled more than 150px from top
            const shouldShowTop = scrollY > 150 && documentHeight > windowHeight + 50;
            setShowScrollTopButton(shouldShowTop);
        };

        // Check immediately and with delays for async content loading
        checkScrollPosition();
        const t1 = setTimeout(checkScrollPosition, 500);
        const t2 = setTimeout(checkScrollPosition, 1500);

        window.addEventListener('scroll', checkScrollPosition, { passive: true });
        window.addEventListener('resize', checkScrollPosition, { passive: true });

        return () => {
            window.removeEventListener('scroll', checkScrollPosition);
            window.removeEventListener('resize', checkScrollPosition);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [isTitle, charCount]); // Also re-run when content changes

    useEffect(() => {
        // Initial resize
        handleResize();

        // Delayed resize calls for async data loading (IndexedDB, Yjs sync)
        const timer1 = setTimeout(() => handleResize(), 100);
        const timer2 = setTimeout(() => handleResize(), 500);
        const timer3 = setTimeout(() => handleResize(), 1500);

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [handleResize]);

    return (
        <div className="relative w-full">
            <textarea
                ref={textareaRef}
                onChange={handleChange}
                onInput={handleResize}
                onPaste={handlePaste}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className={cn(
                    "w-full bg-transparent outline-none resize-none overflow-hidden",
                    "placeholder:text-surface-700/40 dark:placeholder:text-gray-500",
                    "focus:ring-0 border-none transition-colors duration-200",
                    isTitle
                        ? "text-2xl md:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white h-auto tracking-tight"
                        : "text-base md:text-lg text-surface-800 dark:text-gray-200 min-h-[300px] leading-relaxed",
                    className
                )}
                rows={isTitle ? 1 : undefined}
                spellCheck="true"
            />
            {showCharCount && !isTitle && (
                <div className="flex items-center justify-end gap-3 text-sm text-surface-700/50 dark:text-gray-500 mt-3 select-none">
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded-md">
                            {wordCount.toLocaleString()}
                        </span>
                        <span>{wordCount === 1 ? "word" : "words"}</span>
                    </div>
                    <span className="text-surface-300 dark:text-surface-600">·</span>
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded-md">
                            {charCount.toLocaleString()}
                        </span>
                        <span>{charCount === 1 ? "character" : "characters"}</span>
                    </div>
                </div>
            )}
            {/* Hidden div for measuring content height without layout thrash */}
            {!isTitle && (
                <div
                    ref={measureRef}
                    aria-hidden="true"
                    className={cn(
                        "absolute top-0 left-0 w-full pointer-events-none invisible overflow-hidden",
                        "text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words",
                        className
                    )}
                    style={{ minHeight: 300 }}
                />
            )}
            {/* Scroll to bottom button - rendered via portal to avoid layout issues */}
            {showScrollButton && !isTitle && typeof document !== 'undefined' && createPortal(
                <button
                    onClick={() => {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }}
                    className={cn(
                        "fixed bottom-6 right-6 z-30",
                        "flex items-center justify-center",
                        "w-12 h-12 rounded-full",
                        "bg-gradient-to-r from-primary-500 to-purple-600",
                        "text-white shadow-lg shadow-primary-500/30",
                        "hover:shadow-xl hover:shadow-primary-500/40",
                        "hover:scale-105 active:scale-95",
                        "transition-all duration-200"
                    )}
                    aria-label="Scroll to bottom"
                    title="Scroll to bottom"
                >
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
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </button>,
                document.body
            )}
            {/* Scroll to top button - rendered via portal to avoid layout issues */}
            {showScrollTopButton && !isTitle && typeof document !== 'undefined' && createPortal(
                <button
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={cn(
                        "fixed bottom-6 right-20 z-30",
                        "flex items-center justify-center",
                        "w-12 h-12 rounded-full",
                        "bg-gradient-to-r from-purple-600 to-primary-500",
                        "text-white shadow-lg shadow-purple-500/30",
                        "hover:shadow-xl hover:shadow-purple-500/40",
                        "hover:scale-105 active:scale-95",
                        "transition-all duration-200"
                    )}
                    aria-label="Scroll to top"
                    title="Scroll to top"
                >
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
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>,
                document.body
            )}
        </div>
    );
}

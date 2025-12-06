"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as Y from "yjs";
import { cn } from "@/lib/utils";

interface EditorProps {
    yText: Y.Text;
    placeholder?: string;
    className?: string;
    isTitle?: boolean;
    showCharCount?: boolean;
}

export function Editor({
    yText,
    placeholder = "Start typing...",
    className,
    isTitle = false,
    showCharCount = false,
}: EditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isUpdatingRef = useRef(false);
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    // Update character count
    const updateCharCount = useCallback(() => {
        const count = yText.toString().length;
        setCharCount(count);
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
            const newValue = e.target.value;
            const oldValue = yText.toString();

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
        [yText, updateCharCount]
    );

    // Immediate resize for growing (no flash) - only checks scrollHeight
    const handleImmediateGrow = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea && !isTitle) {
            // Only grow - this is instant and doesn't cause flash
            if (textarea.scrollHeight > textarea.offsetHeight) {
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        }
    }, [isTitle]);

    // Debounced resize for shrinking - runs after user stops typing
    const handleDebouncedShrink = useCallback((skipScrollRestore = false) => {
        const textarea = textareaRef.current;
        if (textarea && !isTitle) {
            // Clear any pending resize
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            // Debounce the shrink calculation
            resizeTimeoutRef.current = setTimeout(() => {
                const scrollTop = window.scrollY;

                // Temporarily set to auto to measure true scrollHeight
                const originalHeight = textarea.style.height;
                textarea.style.height = 'auto';
                const newHeight = Math.max(textarea.scrollHeight, 300);

                // Restore immediately if growing or same
                if (newHeight >= textarea.offsetHeight) {
                    textarea.style.height = `${newHeight}px`;
                } else {
                    // Shrink to new size
                    textarea.style.height = `${newHeight}px`;
                }

                // Only restore scroll position if not pasting
                if (!skipScrollRestore) {
                    window.scrollTo(0, scrollTop);
                }
            }, 300); // 300ms debounce - runs after user stops typing
        }
    }, [isTitle]);

    // Combined handler
    const handleResize = useCallback(() => {
        handleImmediateGrow();
        handleDebouncedShrink(false);
    }, [handleImmediateGrow, handleDebouncedShrink]);

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

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    return (
        <div className={cn(
            "relative w-full transition-all duration-300",
            isFocused && !isTitle && "ring-2 ring-primary-500/20 rounded-xl -m-2 p-2"
        )}>
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
                <div className="flex items-center justify-end gap-2 text-sm text-surface-700/50 dark:text-gray-500 mt-3 select-none">
                    <span className="font-mono text-xs bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded-md">
                        {charCount.toLocaleString()}
                    </span>
                    <span>{charCount === 1 ? "character" : "characters"}</span>
                </div>
            )}
        </div>
    );
}

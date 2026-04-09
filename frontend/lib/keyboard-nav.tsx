"use client";

import { useEffect } from "react";

/**
 * Hook for keyboard navigation
 * Handles common keyboard shortcuts
 */
export function useKeyboardNavigation(callbacks: {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (isInput && e.key !== "Escape") return;

      switch (e.key) {
        case "Enter":
          if (callbacks.onEnter) {
            e.preventDefault();
            callbacks.onEnter();
          }
          break;
        case "Escape":
          if (callbacks.onEscape) {
            e.preventDefault();
            callbacks.onEscape();
          }
          break;
        case "ArrowUp":
          if (callbacks.onArrowUp) {
            e.preventDefault();
            callbacks.onArrowUp();
          }
          break;
        case "ArrowDown":
          if (callbacks.onArrowDown) {
            e.preventDefault();
            callbacks.onArrowDown();
          }
          break;
        case "ArrowLeft":
          if (callbacks.onArrowLeft) {
            e.preventDefault();
            callbacks.onArrowLeft();
          }
          break;
        case "ArrowRight":
          if (callbacks.onArrowRight) {
            e.preventDefault();
            callbacks.onArrowRight();
          }
          break;
        case "Tab":
          if (callbacks.onTab) {
            e.preventDefault();
            callbacks.onTab();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callbacks]);
}

/**
 * Accessibility helper component
 * Displays keyboard shortcuts on page
 */
export function KeyboardShortcuts({
  shortcuts,
}: {
  shortcuts: Array<{ key: string; description: string }>;
}) {
  return (
    <details className="p-4 rounded-lg bg-muted/20 border border-border text-sm">
      <summary className="cursor-pointer font-semibold text-muted-foreground hover:text-foreground transition-colors">
        ⌨️ Keyboard Shortcuts
      </summary>
      <div className="mt-4 space-y-2">
        {shortcuts.map((shortcut, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-muted-foreground">{shortcut.description}</span>
            <kbd className="px-2 py-1 rounded bg-background/80 border border-border text-xs font-mono">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </details>
  );
}

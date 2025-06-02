import { useEffect, useCallback } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: ShortcutHandler;
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(
        (shortcut) =>
          shortcut.key.toLowerCase() === e.key.toLowerCase() &&
          !!shortcut.ctrlKey === e.ctrlKey &&
          !!shortcut.metaKey === e.metaKey &&
          !!shortcut.shiftKey === e.shiftKey &&
          !!shortcut.altKey === e.altKey
      );

      if (matchingShortcut) {
        e.preventDefault();
        matchingShortcut.handler(e);
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}; 
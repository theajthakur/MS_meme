"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  /** Unique id to track which button is in "copied" state */
  copyId: string;
  activeCopiedId: string | null;
  onCopy: (text: string, id: string) => void;
  size?: number;
  className?: string;
  label?: string;
}

/**
 * Reusable copy-to-clipboard button.
 * Shows a checkmark for 2 seconds after copying.
 *
 * Usage:
 *   <CopyButton text={url} copyId="my-btn" activeCopiedId={copiedId} onCopy={handleCopy} />
 */
export default function CopyButton({
  text,
  copyId,
  activeCopiedId,
  onCopy,
  size = 12,
  className = "",
  label,
}: CopyButtonProps) {
  const isCopied = activeCopiedId === copyId;

  return (
    <button
      onClick={() => onCopy(text, copyId)}
      className={`border-win-button px-2 py-1 flex items-center gap-1.5 justify-center hover:bg-zinc-100 ${className}`}
      title={label ? undefined : "Copy"}
    >
      {isCopied ? (
        <Check size={size} className="text-green-700 stroke-[3px]" />
      ) : (
        <Copy size={size} />
      )}
      {label && <span>{isCopied ? "Copied!" : label}</span>}
    </button>
  );
}

/**
 * Standalone copy hook — use when you need copy state without the button UI.
 */
export function useCopy(timeoutMs = 2000) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), timeoutMs);
  };

  return { copiedId, handleCopy };
}

"use client";

import React, { useState, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

interface Win98ModalProps {
  /** Icon element shown in the title bar */
  icon?: ReactNode;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Width class, e.g. "w-[420px]". Defaults to w-[420px] */
  width?: string;
}

/**
 * Generic Win98-styled portal modal.
 * Renders into document.body via a React Portal so it escapes any parent
 * overflow/transform stacking context.
 *
 * Usage:
 *   <Win98Modal icon={<BarChart2 size={12} />} title="My Dialog" onClose={close}>
 *     ...body content...
 *   </Win98Modal>
 */
export default function Win98Modal({
  icon,
  title,
  onClose,
  children,
  width = "w-[420px]",
}: Win98ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 99999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-[#c0c0c0] border-win-out ${width} max-w-[95vw] select-none shadow-2xl`}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-[#000080] to-[#1084d0]">
          <div className="flex items-center gap-1.5">
            {icon && <span className="text-white">{icon}</span>}
            <span className="text-white text-xs font-bold font-win-sans">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-4 h-4 bg-[#c0c0c0] border-win-button flex items-center justify-center text-black text-[10px] font-bold leading-none active:border-win-button-depressed"
            title="Close"
          >
            <X size={9} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-xs font-win-sans">{children}</div>
      </div>
    </div>,
    document.body
  );
}

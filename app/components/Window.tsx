"use client";

import React, { useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { Minus, Square, X, RotateCcw } from "lucide-react";

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  initialX?: number;
  initialY?: number;
  width?: string | number;
  height?: string | number;
  icon?: React.ReactNode;
  menuItems?: {
    label: string;
    items: { label: string; onClick: () => void }[];
  }[];
  children: React.ReactNode;
}

export default function Window({
  id,
  title,
  isOpen,
  isMinimized,
  isMaximized,
  isActive,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  initialX = 100,
  initialY = 100,
  width = 600,
  height = 400,
  icon,
  menuItems,
  children,
}: WindowProps) {
  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);

  // Dropdown menu state
  const [activeMenuIndex, setActiveMenuIndex] = React.useState<number | null>(null);

  if (!isOpen || isMinimized) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    onFocus();
    // Only start drag if clicking the title bar itself and not the window control buttons
    const target = e.target as HTMLElement;
    if (target.closest(".window-controls")) return;
    dragControls.start(e);
  };

  return (
    <motion.div
      ref={windowRef}
      initial={isMaximized ? { x: 0, y: 0 } : { x: initialX, y: initialY }}
      animate={
        isMaximized
          ? {
              x: 0,
              y: 0,
              width: "100%",
              height: "calc(100vh - 40px)", // Leave space for taskbar
              scale: 1,
            }
          : {
              width: width,
              height: height,
              scale: 1,
            }
      }
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      style={{ zIndex }}
      onPointerDown={onFocus}
      className={`absolute flex flex-col border-win-out bg-[#c0c0c0] text-black overflow-hidden font-win-sans`}
    >
      {/* Title Bar */}
      <div
        onPointerDown={handlePointerDown}
        className={`flex items-center justify-between p-[3px] select-none cursor-default ${
          isActive
            ? "bg-gradient-to-r from-[#000080] to-[#1084d0] text-white"
            : "bg-[#808080] text-[#c0c0c0]"
        }`}
      >
        <div className="flex items-center gap-1.5 px-1 font-bold text-sm truncate">
          {icon && <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>}
          <span className="truncate pr-4">{title}</span>
        </div>

        {/* Window controls */}
        <div className="window-controls flex items-center gap-1 pr-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="flex items-center justify-center w-[16px] h-[14px] bg-[#c0c0c0] text-black border-win-button active:border-win-button-depressed outline-none"
          >
            <Minus size={10} className="stroke-[3px]" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            className="flex items-center justify-center w-[16px] h-[14px] bg-[#c0c0c0] text-black border-win-button active:border-win-button-depressed outline-none"
          >
            {isMaximized ? (
              <RotateCcw size={8} className="stroke-[3px]" />
            ) : (
              <Square size={8} className="stroke-[3px]" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex items-center justify-center w-[16px] h-[14px] bg-[#c0c0c0] text-black border-win-button active:border-win-button-depressed outline-none ml-0.5 font-bold"
          >
            <X size={10} className="stroke-[3px]" />
          </button>
        </div>
      </div>

      {/* Menu Bar (if any) */}
      {menuItems && menuItems.length > 0 && (
        <div className="relative flex items-center bg-[#c0c0c0] border-b border-[#808080] px-2 py-0.5 text-xs select-none z-50">
          {menuItems.map((menu, idx) => (
            <div key={idx} className="relative">
              <button
                onClick={() => setActiveMenuIndex(activeMenuIndex === idx ? null : idx)}
                onMouseEnter={() => {
                  if (activeMenuIndex !== null) setActiveMenuIndex(idx);
                }}
                className={`px-2 py-1 hover:bg-[#000080] hover:text-white cursor-default rounded-none ${
                  activeMenuIndex === idx ? "bg-[#808080] text-white" : ""
                }`}
              >
                {menu.label}
              </button>
              
              {activeMenuIndex === idx && (
                <>
                  <div
                    onClick={() => setActiveMenuIndex(null)}
                    className="fixed inset-0 z-40 bg-transparent"
                  />
                  <div className="absolute left-0 mt-0.5 bg-[#c0c0c0] border-win-out flex flex-col min-w-[120px] shadow-md z-50 py-0.5">
                    {menu.items.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        onClick={() => {
                          item.onClick();
                          setActiveMenuIndex(null);
                        }}
                        className="px-4 py-1.5 text-left text-xs text-black hover:bg-[#000080] hover:text-white cursor-default w-full outline-none"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Window Content */}
      <div className="flex-1 bg-white border-win-in m-1 p-1 overflow-auto select-text flex flex-col relative text-sm">
        {children}
      </div>
    </motion.div>
  );
}

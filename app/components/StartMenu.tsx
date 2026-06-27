"use client";

import React, { useRef, useEffect } from "react";
import { Monitor, HelpCircle, FileText, Paintbrush, Play, Power } from "lucide-react";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
  onShutDown: () => void;
}

export default function StartMenu({ isOpen, onClose, onOpenApp, onShutDown }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // Check if the click was on the Start Button itself (handled separately in Taskbar)
        const target = e.target as HTMLElement;
        if (target.closest(".start-button")) return;
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      id: "welcome",
      label: "Welcome Screen",
      icon: <span className="text-sm">👋</span>,
      description: "Immersive fullscreen prompt",
    },
    {
      id: "url-shortener",
      label: "URL Shortener Wizard",
      icon: <span className="text-sm">🔗</span>,
      description: "Compress long web links",
    },
    {
      id: "readme",
      label: "README.txt (Notepad)",
      icon: <FileText size={16} className="text-yellow-600" />,
      description: "Read documentation",
    },
    {
      id: "paint",
      label: "MS Paint Drawing",
      icon: <Paintbrush size={16} className="text-pink-600" />,
      description: "Interactive canvas board",
    },
    {
      id: "gta-vice-city",
      label: "GTA India",
      icon: <img src="https://cdn2.steamgriddb.com/icon/722caafb4825ef5d8670710fa29087cf/32/256x256.png" className="w-4 h-4 object-contain select-none" alt="" />,
      description: "Simulated radio & cheats",
    },
    {
      id: "my-computer",
      label: "System Properties",
      icon: <Monitor size={16} className="text-blue-800" />,
      description: "View computer specifications",
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute left-1 bottom-[40px] w-[260px] h-[320px] bg-[#c0c0c0] border-win-out flex z-[999999] select-none font-win-sans shadow-2xl"
    >
      {/* Left Vertical Band */}
      <div className="w-[32px] bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center pb-3">
        <span className="text-white font-bold font-win-sans tracking-wide text-md origin-center -rotate-90 select-none pointer-events-none whitespace-nowrap mb-6 flex items-center gap-1">
          Windows<span className="font-light">98</span>
        </span>
      </div>

      {/* Menu Options List */}
      <div className="flex-1 flex flex-col justify-between py-1 bg-[#c0c0c0]">
        <div className="flex flex-col">
          <div className="px-3 py-1 text-[10px] text-zinc-500 font-bold border-b border-[#808080] mb-1">
            PROGRAMS & UTILITIES
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onOpenApp(item.id);
                onClose();
              }}
              className="w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-[#000080] hover:text-white group select-none outline-none cursor-default"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-zinc-200 border-win-in group-hover:bg-[#000080] group-hover:border-win-out-thin shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold leading-tight truncate">{item.label}</span>
                <span className="text-[9px] text-zinc-600 leading-tight truncate group-hover:text-zinc-200">
                  {item.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Shut Down Action */}
        <div className="border-t border-[#808080] pt-1">
          <button
            onClick={() => {
              onShutDown();
              onClose();
            }}
            className="w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-[#000080] hover:text-white group select-none outline-none cursor-default"
          >
            <div className="w-6 h-6 flex items-center justify-center bg-red-100 border-win-in group-hover:bg-[#000080] group-hover:border-win-out-thin shrink-0">
              <Power size={14} className="text-red-700 group-hover:text-red-200" />
            </div>
            <span className="text-xs font-bold">Shut Down...</span>
          </button>
        </div>
      </div>
    </div>
  );
}

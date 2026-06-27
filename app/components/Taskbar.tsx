"use client";

import React, { useState, useEffect } from "react";
import { Volume2, Wifi } from "lucide-react";

interface WindowItem {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  icon?: React.ReactNode;
}

interface TaskbarProps {
  windows: WindowItem[];
  isStartOpen: boolean;
  onToggleStart: () => void;
  onToggleWindow: (id: string) => void;
}

export default function Taskbar({ windows, isStartOpen, onToggleStart, onToggleWindow }: TaskbarProps) {
  const [time, setTime] = useState("");

  // Update clock time
  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[40px] bg-[#c0c0c0] border-t-2 border-t-white flex justify-between items-center px-1 z-[999999] select-none font-win-sans shadow-md">
      {/* Start Button & Active Window Buttons */}
      <div className="flex items-center gap-1.5 h-full overflow-hidden flex-1">
        {/* Start Button */}
        <button
          onClick={onToggleStart}
          className={`start-button flex items-center gap-1 h-[28px] px-2 bg-[#c0c0c0] select-none outline-none ${
            isStartOpen
              ? "border-win-in border-win-button-depressed font-bold"
              : "border-win-button font-bold active:border-win-button-depressed"
          }`}
        >
          {/* Retro Windows Flag representation */}
          <div className="grid grid-cols-2 gap-[1px] w-3 h-3 rotate-6 mr-0.5 select-none">
            <div className="bg-red-500 w-1.5 h-1.5 rounded-sm" />
            <div className="bg-green-500 w-1.5 h-1.5 rounded-sm" />
            <div className="bg-blue-500 w-1.5 h-1.5 rounded-sm" />
            <div className="bg-yellow-500 w-1.5 h-1.5 rounded-sm" />
          </div>
          <span className="text-xs">Start</span>
        </button>

        {/* Vertical divider */}
        <div className="w-[2px] h-[24px] bg-[#808080] border-r border-r-white mx-0.5" />

        {/* Window Tabs in Taskbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto flex-1 h-full py-1 pr-4 no-scrollbar">
          {windows
            .filter((win) => win.isOpen)
            .map((win) => (
              <button
                key={win.id}
                onClick={() => onToggleWindow(win.id)}
                className={`flex items-center gap-1.5 h-[28px] min-w-[80px] max-w-[150px] px-2 select-none outline-none truncate text-left ${
                  win.isActive && !win.isMinimized
                    ? "border-win-in bg-[#dfdfdf] font-bold border-win-button-depressed"
                    : "border-win-button bg-[#c0c0c0] active:border-win-button-depressed"
                }`}
              >
                {win.icon && (
                  <span className="flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center">
                    {win.icon}
                  </span>
                )}
                <span className="text-[11px] truncate">{win.title}</span>
              </button>
            ))}
        </div>
      </div>

      {/* System Tray (Clock and Tray Icons) */}
      <div className="flex items-center gap-2 border-win-in px-2.5 h-[28px] bg-[#c0c0c0] font-win-sans flex-shrink-0 ml-2">
        <Wifi size={13} className="text-zinc-700 hover:text-black cursor-pointer" />
        <Volume2 size={13} className="text-zinc-700 hover:text-black cursor-pointer" />
        <div className="w-[1.5px] h-[14px] bg-[#808080] mx-0.5" />
        <span className="text-[10px] font-bold text-black font-win-sans">{time}</span>
      </div>
    </div>
  );
}

"use client";

import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface Win98TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

/**
 * Reusable Win98-styled tab bar.
 *
 * Usage:
 *   <Win98TabBar
 *     tabs={[{ id: "general", label: "General" }, { id: "network", label: "Network" }]}
 *     activeTab={activeTab}
 *     onTabChange={setActiveTab}
 *   />
 */
export default function Win98TabBar({ tabs, activeTab, onTabChange }: Win98TabBarProps) {
  return (
    <div className="flex border-b border-[#808080]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-1.5 text-sm cursor-default border-t border-x rounded-t-md transition-all outline-none ${
            activeTab === tab.id
              ? "bg-[#c0c0c0] border-t-white border-x-white font-bold -mb-[1px] z-10"
              : "bg-[#b0b0b0] border-t-transparent border-x-transparent text-[#505050] hover:bg-[#b8b8b8]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

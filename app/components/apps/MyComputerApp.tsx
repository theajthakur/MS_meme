"use client";

import React, { useState, useEffect, useRef } from "react";
import { Monitor, Network, Cpu, ShieldCheck, Activity, RefreshCw } from "lucide-react";

export default function MyComputerApp() {
  const [activeTab, setActiveTab] = useState<"general" | "storage" | "network" | "credits">("general");
  const [pinging, setPinging] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [pingError, setPingError] = useState<string | null>(null);
  const [linksCount, setLinksCount] = useState(0);
  const pingingRef = useRef(false);

  // Load link count on mount and stay in sync with storage updates
  useEffect(() => {
    const updateStats = () => {
      const stored = localStorage.getItem("url_shortener_history");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLinksCount(parsed.length);
        } catch (e) {}
      } else {
        setLinksCount(0);
      }
    };
    updateStats();
    
    // Periodically sync stats in case they change without local storage event (same-tab actions)
    const statSyncInterval = setInterval(updateStats, 1000);

    window.addEventListener("storage", updateStats);
    return () => {
      clearInterval(statSyncInterval);
      window.removeEventListener("storage", updateStats);
    };
  }, []);

  const systemSpace = 35; // GB
  const linksSpace = linksCount * 5; // GB
  const usedSpace = systemSpace + linksSpace; // GB
  const freeSpace = 64 - usedSpace; // GB
  const usedPercent = (usedSpace / 64) * 100;

  const getStorageColorClass = () => {
    if (usedSpace < 50) return "bg-[#22c55e]"; // GREEN
    if (usedSpace >= 50 && usedSpace <= 90) return "bg-[#0000ff]"; // BLUE
    return "bg-[#ef4444]"; // RED
  };

  const pingBackend = async () => {
    if (pingingRef.current) return;
    pingingRef.current = true;
    setPinging(true);
    setPingError(null);
    const start = performance.now();
    try {
      // Call GET /api/shorten to query backend health endpoint
      const res = await fetch("/api/shorten", {
        method: "GET",
      });
      await res.json();
      const end = performance.now();
      setLatency(Math.round(end - start));
    } catch (e) {
      setPingError("Failed to calculate roundtrip latency.");
    } finally {
      setPinging(false);
      pingingRef.current = false;
    }
  };

  useEffect(() => {
    if (activeTab === "network") {
      pingBackend();
      // Poll latency constantly every 3 seconds
      const interval = setInterval(pingBackend, 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win-sans text-black select-none p-1">
      {/* Tabs */}
      <div className="flex border-b border-[#808080] mb-3">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-3 py-1 text-xs cursor-default border-t border-x rounded-t transition-all outline-none ${
            activeTab === "general"
              ? "bg-[#c0c0c0] border-t-white border-x-white font-bold -mb-[1px] z-10"
              : "bg-[#b0b0b0] border-t-transparent border-x-transparent text-[#505050] hover:bg-[#b8b8b8]"
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("storage")}
          className={`px-3 py-1 text-xs cursor-default border-t border-x rounded-t transition-all outline-none ${
            activeTab === "storage"
              ? "bg-[#c0c0c0] border-t-white border-x-white font-bold -mb-[1px] z-10"
              : "bg-[#b0b0b0] border-t-transparent border-x-transparent text-[#505050] hover:bg-[#b8b8b8]"
          }`}
        >
          Storage (C:)
        </button>
        <button
          onClick={() => setActiveTab("network")}
          className={`px-3 py-1 text-xs cursor-default border-t border-x rounded-t transition-all outline-none ${
            activeTab === "network"
              ? "bg-[#c0c0c0] border-t-white border-x-white font-bold -mb-[1px] z-10"
              : "bg-[#b0b0b0] border-t-transparent border-x-transparent text-[#505050] hover:bg-[#b8b8b8]"
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab("credits")}
          className={`px-3 py-1 text-xs cursor-default border-t border-x rounded-t transition-all outline-none ${
            activeTab === "credits"
              ? "bg-[#c0c0c0] border-t-white border-x-white font-bold -mb-[1px] z-10"
              : "bg-[#b0b0b0] border-t-transparent border-x-transparent text-[#505050] hover:bg-[#b8b8b8]"
          }`}
        >
          Credits
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 border-win-in bg-[#dfdfdf] p-4 flex flex-col overflow-auto">
        {activeTab === "storage" && (
          <div className="space-y-4 text-xs select-none text-black flex-1 flex flex-col justify-between">
            <div className="flex gap-4 items-start pb-2 border-b border-zinc-400">
              <div className="flex items-center justify-center p-2 bg-[#c0c0c0] border-win-out w-14 h-14 shrink-0">
                <span className="text-3xl">💽</span>
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>Local Disk (C:) Properties</span>
                </div>
                <div className="text-[10px] text-zinc-600">File system: FAT32</div>
              </div>
            </div>

            <div className="space-y-2.5 font-win-sans flex-1 py-2">
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 border-win-in ${getStorageColorClass()}`} />
                <div className="flex-1 flex justify-between">
                  <span>Used Space:</span>
                  <span className="font-win-mono font-bold">{usedSpace.toFixed(1)} GB</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-win-in bg-[#a0a0a0]" />
                <div className="flex-1 flex justify-between">
                  <span>Free Space:</span>
                  <span className="font-win-mono font-bold">{freeSpace.toFixed(1)} GB</span>
                </div>
              </div>

              <div className="h-[2px] bg-[#808080] border-b border-b-white my-2" />

              <div className="flex justify-between font-bold">
                <span>Capacity:</span>
                <span className="font-win-mono">64.0 GB</span>
              </div>

              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[10px] font-semibold text-zinc-700">
                  <span>Disk Utilization:</span>
                  <span>{usedPercent.toFixed(1)}%</span>
                </div>
                
                <div className="border-win-in h-[22px] w-full bg-[#dfdfdf] p-0.5 flex overflow-hidden">
                  <div
                    className={`h-full border-r border-[#808080] ${getStorageColorClass()}`}
                    style={{ width: `${usedPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="border-win-out bg-[#c0c0c0] p-3 text-[10px] leading-relaxed text-zinc-700">
              <div className="font-bold text-black mb-1">Disk Allocations:</div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>System files (fat-32 boot / drivers): <strong>35.0 GB</strong> (Static)</li>
                <li>Link History database storage: <strong>{linksSpace.toFixed(1)} GB</strong> (5.0 GB per compressed link, max 5)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "general" && (
          <div className="flex gap-6 items-start">
            <div className="flex flex-col items-center justify-center p-2 bg-[#c0c0c0] border-win-out w-20 h-20">
              <Monitor size={36} className="text-[#000080]" />
              <span className="text-[10px] font-bold mt-1">SYS PROPERTIES</span>
            </div>

            <div className="flex-1 space-y-4 text-xs">
              <div>
                <h3 className="font-bold border-b border-zinc-400 pb-1">System:</h3>
                <p className="mt-1 font-win-sans">Microsoft Windows 98</p>
                <p>Second Edition (Build 1998.SE)</p>
                <p>Next.js Core Framework 16.2.9</p>
              </div>

              <div>
                <h3 className="font-bold border-b border-zinc-400 pb-1">Registered to:</h3>
                <p className="mt-1 font-semibold">theajthakur</p>
                <p>github/theajthakur</p>
              </div>

              <div>
                <h3 className="font-bold border-b border-zinc-400 pb-1">Computer Details:</h3>
                <p className="mt-1 flex items-center gap-1"><Cpu size={12} /> Genuine Intel(R) Core(TM) i9 CPU</p>
                <p className="pl-4">64.0 MB of RAM (Expandable)</p>
                <p className="pl-4">Hypertext Web Storage (LocalStorage DB)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "network" && (
          <div className="space-y-4 text-xs flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Network size={28} className="text-zinc-700" />
                <div>
                  <h3 className="font-bold text-sm">Server Latency Monitor</h3>
                  <p className="text-[10px] text-zinc-600">Measures the API connection time to the Render FastAPI server.</p>
                </div>
              </div>

              <div className="border-win-out bg-[#c0c0c0] p-4 space-y-2 font-win-mono">
                <div className="flex justify-between">
                  <span>Backend Server URL:</span>
                  <span className="text-blue-800 font-bold truncate max-w-[180px]">fastapi-url-shortener-...</span>
                </div>
                <div className="flex justify-between">
                  <span>Connection State:</span>
                  <span className="text-green-800 font-bold">CONNECTED</span>
                </div>
                <div className="flex justify-between border-t border-zinc-400 pt-2 font-bold text-sm items-center">
                  <span>API Ping Latency:</span>
                  <div className="flex items-center gap-1.5">
                    {pinging ? (
                      <>
                        <RefreshCw size={12} className="animate-spin text-zinc-500" />
                        <span className="text-zinc-600 animate-pulse">Measuring...</span>
                      </>
                    ) : latency !== null ? (
                      <>
                        <Activity
                          size={12}
                          className={`${
                            latency > 300
                              ? "text-red-600"
                              : latency > 150
                              ? "text-yellow-600 animate-pulse"
                              : "text-green-600 animate-pulse"
                          }`}
                        />
                        <span className={latency > 250 ? "text-yellow-700" : "text-green-700"}>
                          {latency} ms
                        </span>
                      </>
                    ) : (
                      <span className="text-zinc-500">Unmeasured</span>
                    )}
                  </div>
                </div>
              </div>

              {pingError && (
                <div className="text-red-700 font-bold font-win-mono text-[10px]">
                  * {pingError}
                </div>
              )}
            </div>

            <button
              onClick={pingBackend}
              disabled={pinging}
              className="border-win-button font-bold py-1.5 active:border-win-button-depressed outline-none self-end px-6 text-xs"
            >
              Test Latency Again
            </button>
          </div>
        )}

        {activeTab === "credits" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b border-zinc-400 pb-2">
              <ShieldCheck size={28} className="text-blue-800" />
              <div>
                <h3 className="font-bold text-sm">MIT Open Source Project</h3>
                <p className="text-[10px] text-zinc-600">Free, public license. Modify as you see fit.</p>
              </div>
            </div>

            <div className="space-y-2 leading-relaxed select-text">
              <p>
                This desktop shell environment was engineered as a pair programming showcase utilizing modern web standards inside a retro wrapper.
              </p>
              <p>
                <strong>Engineered by:</strong> theajthakur (github/theajthakur)
              </p>
              <p>
                <strong>Design Philosophy:</strong> Windows 95/98 pixel accuracy, instant client responses, component modularity, and smooth React transitions.
              </p>
              <p className="text-zinc-600 mt-4 text-[10px]">
                Copyright © 2026. Microsoft, Windows, and the Windows logo are registered trademarks of Microsoft Corporation in the United States and other countries. This is an educational tribute project.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

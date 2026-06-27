"use client";

import React, { useState, useEffect } from "react";
import Window from "./Window";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";

// Apps
import UrlShortenerApp from "./apps/UrlShortenerApp";
import NotepadApp from "./apps/NotepadApp";
import PaintApp from "./apps/PaintApp";
import GtaViceCityApp from "./apps/GtaViceCityApp";
import MyComputerApp from "./apps/MyComputerApp";
import { motion } from "framer-motion";

import { Monitor, FileText, Paintbrush, Trash2, FolderSync } from "lucide-react";

interface HistoryItem {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}

interface WindowItem {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: string | number;
  height: string | number;
  icon: React.ReactNode;
}

export default function Desktop() {
  const [windows, setWindows] = useState<WindowItem[]>([
    {
      id: "welcome",
      title: "Welcome to Windows 98",
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isActive: true,
      zIndex: 100,
      x: 120,
      y: 80,
      width: 480,
      height: 320,
      icon: <span className="text-sm select-none">👋</span>,
    },
    {
      id: "url-shortener",
      title: "URL Shortener Wizard",
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isActive: false,
      zIndex: 10,
      x: 80,
      y: 50,
      width: 580,
      height: 480,
      icon: <span className="text-sm select-none">🔗</span>,
    },
    {
      id: "readme",
      title: "README.txt - Notepad",
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isActive: false,
      zIndex: 5,
      x: 180,
      y: 80,
      width: 600,
      height: 420,
      icon: <FileText size={14} className="text-yellow-600 select-none" />,
    },
    {
      id: "paint",
      title: "untitled - Paint",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isActive: false,
      zIndex: 1,
      x: 140,
      y: 120,
      width: 640,
      height: 480,
      icon: <Paintbrush size={14} className="text-pink-600 select-none" />,
    },
    {
      id: "gta-vice-city",
      title: "GTA: India",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isActive: false,
      zIndex: 1,
      x: 220,
      y: 100,
      width: 480,
      height: 420,
      icon: <img src="https://cdn2.steamgriddb.com/icon/722caafb4825ef5d8670710fa29087cf/32/256x256.png" className="w-4 h-4 object-contain select-none" alt="GTA VC" />,
    },
    {
      id: "my-computer",
      title: "System Properties",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isActive: false,
      zIndex: 1,
      x: 200,
      y: 180,
      width: 480,
      height: 380,
      icon: <Monitor size={14} className="text-blue-800 select-none" />,
    },
    {
      id: "recycle-bin",
      title: "Recycle Bin",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isActive: false,
      zIndex: 1,
      x: 120,
      y: 220,
      width: 520,
      height: 350,
      icon: <Trash2 size={14} className="text-zinc-700 select-none" />,
    },
    {
      id: "storage-error",
      title: "Storage Error",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isActive: false,
      zIndex: 150,
      x: 180,
      y: 160,
      width: 360,
      height: 180,
      icon: <span className="text-sm select-none">❌</span>,
    },
    {
      id: "gta-loader",
      title: "Updating",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isActive: false,
      zIndex: 160,
      x: 200,
      y: 180,
      width: 380,
      height: 150,
      icon: <span className="text-sm select-none">⚙️</span>,
    },
    {
      id: "gta-graphic-error",
      title: "Fatal Error",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isActive: false,
      zIndex: 200,
      x: 200,
      y: 180,
      width: 320,
      height: 140,
      icon: <span className="text-sm select-none">❌</span>,
    },
  ]);

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [deletedLinks, setDeletedLinks] = useState<HistoryItem[]>([]);
  const [historyTrigger, setHistoryTrigger] = useState(0);

  // Easter Egg states
  const [isBsod, setIsBsod] = useState(false);
  const [showWelcomeCheckbox, setShowWelcomeCheckbox] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0,
  });
  const [spawnedTanks, setSpawnedTanks] = useState<{ id: string; x: number; y: number }[]>([]);
  const [cheatNotification, setCheatNotification] = useState("");
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [videoDownloadPercent, setVideoDownloadPercent] = useState(0);

  const handleCheatCode = (cheat: string) => {
    setCheatNotification(`CHEAT CODE ACTIVATED: ${cheat}`);
    setTimeout(() => setCheatNotification(""), 3000);

    if (cheat === "ASPIRINE") {
      // Heal storage!
      localStorage.removeItem("url_shortener_history");
      setHistoryTrigger((p) => p + 1);
    } else if (cheat === "PANZER") {
      setSpawnedTanks((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          x: 150 + Math.random() * 300,
          y: 150 + Math.random() * 300,
        },
      ]);
    } else if (cheat === "BIGBANG") {
      setWindows((prev) => prev.map((w) => ({ ...w, isOpen: false, isActive: false })));
    }
  };

  // Start downloading the video in background on app load
  useEffect(() => {
    let active = true;
    const downloadGtaVideo = async () => {
      try {
        const response = await fetch("/GTA_INDIA.mp4");
        if (!response.ok) throw new Error("Status " + response.status);
        if (!response.body) throw new Error("Response body not readable");

        const contentLength = response.headers.get("content-length");
        if (!contentLength) {
          // Fallback if content-length header is not present
          for (let i = 0; i <= 100; i += 5) {
            if (!active) return;
            setVideoDownloadPercent(i);
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          setVideoBlobUrl("/GTA_INDIA.mp4");
          return;
        }

        const totalBytes = parseInt(contentLength, 10);
        let loadedBytes = 0;
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (value) {
            chunks.push(value);
            loadedBytes += value.length;
            const percent = Math.round((loadedBytes / totalBytes) * 100);
            if (active) {
              setVideoDownloadPercent(percent);
            }
          }
        }

        const blob = new Blob(chunks as any, { type: "video/mp4" });
        const objUrl = URL.createObjectURL(blob);
        if (active) {
          setVideoBlobUrl(objUrl);
          setVideoDownloadPercent(100);
        }
      } catch (err) {
        console.error("GTA Video background prefetching failed, streaming fallback active:", err);
        if (active) {
          setVideoDownloadPercent(100);
          setVideoBlobUrl("/GTA_INDIA.mp4");
        }
      }
    };

    downloadGtaVideo();

    return () => {
      active = false;
    };
  }, []);

  // When updating finishes, auto-close the loader and launch fullscreen game
  useEffect(() => {
    if (videoDownloadPercent === 100) {
      const gtaLoader = windows.find((w) => w.id === "gta-loader");
      if (gtaLoader?.isOpen) {
        setWindows((prev) =>
          prev.map((w) => {
            if (w.id === "gta-loader") return { ...w, isOpen: false, isActive: false };
            if (w.id === "gta-vice-city") return { ...w, isOpen: true, isMinimized: false, isActive: true };
            return w;
          })
        );
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((err) => console.log(err));
        }
      }
    }
  }, [videoDownloadPercent, windows]);

  // Intercept right-clicks (except child defaultPrevented elements) and Ctrl hotkeys
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      e.preventDefault();
      // Calculate coordinates to keep context menu inside viewport bounds
      const menuWidth = 200;
      const menuHeight = 310;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight);

      setContextMenu({
        visible: true,
        x,
        y,
      });
    };

    let keyBuffer = "";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Exit full screen if active
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => console.error("Error exiting fullscreen:", err));
        }
        // Close GTA India game window
        setWindows((prev) =>
          prev.map((w) =>
            w.id === "gta-vice-city" ? { ...w, isOpen: false, isActive: false } : w
          )
        );
        return;
      }

      // Capture keystrokes for global cheats
      if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        keyBuffer += e.key.toUpperCase();
        if (keyBuffer.length > 20) {
          keyBuffer = keyBuffer.slice(-20);
        }

        if (keyBuffer.endsWith("ASPIRINE")) {
          handleCheatCode("ASPIRINE");
          keyBuffer = "";
        } else if (keyBuffer.endsWith("PANZER")) {
          handleCheatCode("PANZER");
          keyBuffer = "";
        } else if (keyBuffer.endsWith("BIGBANG")) {
          handleCheatCode("BIGBANG");
          keyBuffer = "";
        }
      }

      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        // Allow Copy, Paste, Cut, Select All, Undo, Redo
        const allowedKeys = ["c", "v", "x", "a", "z", "y"];
        if (allowedKeys.includes(key)) {
          return;
        }

        e.preventDefault();
        // Map Ctrl+R to desktop refresh
        if (key === "r") {
          setHistoryTrigger((p) => p + 1);
        }
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // Close GTA India game window when exiting fullscreen
        setWindows((prev) =>
          prev.map((w) =>
            w.id === "gta-vice-city" ? { ...w, isOpen: false, isActive: false } : w
          )
        );
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleClearDatabase = () => {
    if (confirm("Are you sure you want to permanently clear the URL shorten database history? This cannot be undone.")) {
      localStorage.removeItem("url_shortener_history");
      setHistoryTrigger(p => p + 1);
    }
  };

  const handleGtaVideoEnd = () => {
    // 1. Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.error("Error exiting fullscreen:", err));
    }
    // 2. Close GTA India game window
    setWindows((prev) =>
      prev.map((w) =>
        w.id === "gta-vice-city" ? { ...w, isOpen: false, isActive: false } : w
      )
    );
    // 3. Trigger graphic card not supported fatal error popup
    openApp("gta-graphic-error");
  };

  // Load deleted links and check welcome screen state on mount
  useEffect(() => {
    const loadDeleted = () => {
      const stored = localStorage.getItem("url_shortener_deleted");
      if (stored) {
        try {
          setDeletedLinks(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to load deleted links", e);
        }
      }
    };
    loadDeleted();

    // Check if we should show the welcome screen
    const showWelcome = localStorage.getItem("show_welcome_screen");
    if (showWelcome === "false") {
      setShowWelcomeCheckbox(false);
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === "welcome") {
            return { ...w, isOpen: false, isActive: false };
          }
          if (w.id === "url-shortener") {
            return { ...w, isActive: true, zIndex: 10 };
          }
          return w;
        })
      );
    }

    // Listen to localStorage changes
    window.addEventListener("storage", loadDeleted);
    return () => window.removeEventListener("storage", loadDeleted);
  }, []);

  const saveDeleted = (newDeleted: HistoryItem[]) => {
    setDeletedLinks(newDeleted);
    localStorage.setItem("url_shortener_deleted", JSON.stringify(newDeleted));
  };

  // Helper to handle focusing windows
  const focusWindow = (id: string) => {
    setWindows((prev) => {
      const maxZ = prev.reduce((max, w) => (w.zIndex > max ? w.zIndex : max), 0);
      return prev.map((w) => {
        if (w.id === id) {
          return { ...w, isActive: true, isMinimized: false, zIndex: maxZ + 1 };
        }
        return { ...w, isActive: false };
      });
    });
  };

  const openApp = (id: string) => {
    if (id === "gta-vice-city") {
      if (videoDownloadPercent < 100) {
        // Direct to updating window dialog
        openApp("gta-loader");
        return;
      }
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => console.log(err));
      }
    }
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, isOpen: true, isMinimized: false };
        }
        return w;
      })
    );
    setTimeout(() => focusWindow(id), 50);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false, isActive: false } : w))
    );
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true, isActive: false } : w))
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  // Taskbar tab clicking logic
  const handleToggleWindow = (id: string) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.isMinimized) {
      // Restore and focus
      focusWindow(id);
    } else if (win.isActive) {
      // Minimize if active
      minimizeWindow(id);
    } else {
      // Focus if inactive
      focusWindow(id);
    }
  };

  // Recycle bin interactions
  const handleAddToRecycleBin = (item: HistoryItem) => {
    const newDeleted = [item, ...deletedLinks];
    saveDeleted(newDeleted);
  };

  const handleRestoreLink = (item: HistoryItem) => {
    // 1. Remove from Recycle Bin
    const newDeleted = deletedLinks.filter((d) => d.id !== item.id);
    saveDeleted(newDeleted);

    // 2. Put back to url_shortener_history
    const storedHistory = localStorage.getItem("url_shortener_history");
    let currentHistory: HistoryItem[] = [];
    if (storedHistory) {
      try {
        currentHistory = JSON.parse(storedHistory);
      } catch (e) { }
    }
    const updatedHistory = [item, ...currentHistory];
    localStorage.setItem("url_shortener_history", JSON.stringify(updatedHistory));

    // 3. Trigger refresh in URL Shortener app
    setHistoryTrigger((prev) => prev + 1);
  };

  const handlePermanentDelete = (id: string) => {
    const newDeleted = deletedLinks.filter((d) => d.id !== id);
    saveDeleted(newDeleted);
  };

  const handleEmptyRecycleBin = () => {
    saveDeleted([]);
  };

  const triggerBsod = () => {
    setIsBsod(true);
  };

  const restartSystem = () => {
    setIsBsod(false);
    // Reset all windows
    setWindows([
      {
        id: "welcome",
        title: "Welcome to Windows 98",
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        isActive: true,
        zIndex: 100,
        x: 120,
        y: 80,
        width: 480,
        height: 320,
        icon: <span className="text-sm select-none">👋</span>,
      },
      {
        id: "url-shortener",
        title: "URL Shortener Wizard",
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        isActive: false,
        zIndex: 10,
        x: 80,
        y: 50,
        width: 580,
        height: 480,
        icon: <span className="text-sm select-none">🔗</span>,
      },
      {
        id: "readme",
        title: "README.txt - Notepad",
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        isActive: false,
        zIndex: 5,
        x: 180,
        y: 80,
        width: 600,
        height: 420,
        icon: <FileText size={14} className="text-yellow-600 select-none" />,
      },
      {
        id: "paint",
        title: "untitled - Paint",
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        isActive: false,
        zIndex: 1,
        x: 140,
        y: 120,
        width: 640,
        height: 480,
        icon: <Paintbrush size={14} className="text-pink-600 select-none" />,
      },
      {
        id: "gta-vice-city",
        title: "GTA: India",
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        isActive: false,
        zIndex: 1,
        x: 220,
        y: 100,
        width: 480,
        height: 420,
        icon: <img src="https://cdn2.steamgriddb.com/icon/722caafb4825ef5d8670710fa29087cf/32/256x256.png" className="w-4 h-4 object-contain select-none" alt="GTA VC" />,
      },
      {
        id: "my-computer",
        title: "System Properties",
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        isActive: false,
        zIndex: 1,
        x: 200,
        y: 180,
        width: 480,
        height: 380,
        icon: <Monitor size={14} className="text-blue-800 select-none" />,
      },
      {
        id: "recycle-bin",
        title: "Recycle Bin",
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        isActive: false,
        zIndex: 1,
        x: 120,
        y: 220,
        width: 520,
        height: 350,
        icon: <Trash2 size={14} className="text-zinc-700 select-none" />,
      },
      {
        id: "storage-error",
        title: "Storage Error",
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        isActive: false,
        zIndex: 150,
        x: 180,
        y: 160,
        width: 360,
        height: 180,
        icon: <span className="text-sm select-none">❌</span>,
      },
      {
        id: "gta-graphic-error",
        title: "Fatal Error",
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        isActive: false,
        zIndex: 200,
        x: 200,
        y: 180,
        width: 320,
        height: 140,
        icon: <span className="text-sm select-none">❌</span>,
      },
      {
        id: "gta-loader",
        title: "Updating",
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        isActive: false,
        zIndex: 160,
        x: 200,
        y: 180,
        width: 380,
        height: 150,
        icon: <span className="text-sm select-none">⚙️</span>,
      },
    ]);
  };

  if (isBsod) {
    return (
      <div
        onClick={restartSystem}
        className="fixed inset-0 bg-[#000082] text-[#aaaaaa] font-win-mono p-12 text-sm z-[9999999] select-none cursor-pointer flex flex-col justify-between crt-effect"
      >
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-[#aaaaaa] text-[#000082] px-3 py-0.5 font-bold w-fit mx-auto text-base">
            Windows
          </div>
          <p>
            A fatal exception 0E has occurred at 0028:C0011A3D in VXD URLSHRT(01) + 00007A2E. The current application will be terminated.
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Press any key or click anywhere to restart your computer.</li>
            <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
          </ul>
          <p className="text-center font-bold mt-12 animate-pulse text-[#ffffff]">
            Click anywhere to reboot the desktop...
          </p>
        </div>
        <div className="text-center text-[10px] opacity-40">
          SYSTEM_ERROR_0x0000007F_URL_SHORTENER_STACK
        </div>
      </div>
    );
  }

  // Desktop Icons config
  const desktopIcons = [
    {
      id: "my-computer",
      label: "My Computer",
      icon: <Monitor size={32} className="text-[#000080]" />,
    },
    {
      id: "recycle-bin",
      label: "Recycle Bin",
      // Change recycle bin icon based on whether it is empty or full!
      icon: (
        <Trash2
          size={32}
          className={deletedLinks.length > 0 ? "text-[#000080]" : "text-zinc-500"}
        />
      ),
    },
    {
      id: "url-shortener",
      label: "URL Shortener Wizard",
      icon: <span className="text-2xl select-none">🔗</span>,
    },
    {
      id: "readme",
      label: "README.txt",
      icon: <FileText size={32} className="text-yellow-600" />,
    },
    {
      id: "paint",
      label: "MS Paint",
      icon: <Paintbrush size={32} className="text-pink-600" />,
    },
    {
      id: "gta-vice-city",
      label: "GTA India",
      icon: <img src="https://cdn2.steamgriddb.com/icon/722caafb4825ef5d8670710fa29087cf/32/256x256.png" className="w-8 h-8 object-contain select-none" alt="GTA VC" />,
    },
  ];

  return (
    <div className="relative w-screen h-screen bg-[#008080] overflow-hidden select-none crt-effect font-win-sans pb-[40px]">
      {/* Draggable Panzer easter egg tanks */}
      {spawnedTanks.map((tank) => (
        <motion.div
          key={tank.id}
          drag
          dragMomentum={false}
          dragElastic={0}
          initial={{ x: tank.x, y: tank.y }}
          className="absolute z-[9999] text-5xl cursor-grab active:cursor-grabbing select-none"
        >
          🚜
        </motion.div>
      ))}

      {/* Desktop Grid Layout for Icons - 2 rows flowing horizontally to prevent vertical clipping */}
      <div className="absolute top-4 left-4 grid grid-rows-2 grid-flow-col gap-4 md:gap-6 justify-start items-center z-0 select-none overflow-x-auto max-w-[calc(100vw-32px)]">
        {desktopIcons.map((icon) => (
          <div
            key={icon.id}
            onDoubleClick={() => openApp(icon.id)}
            onTouchEnd={() => openApp(icon.id)} // Support mobile click
            className="flex flex-col items-center justify-center w-20 h-20 cursor-default text-center group select-none"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-transparent border border-transparent group-hover:bg-[#000080]/10 group-hover:border-[#ffffff]/10 select-none">
              {icon.icon}
            </div>
            <span className="text-white text-[11px] font-bold mt-1.5 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)] px-1 group-hover:bg-[#000080] group-hover:text-white select-none whitespace-normal leading-tight break-words max-w-[76px]">
              {icon.label}
            </span>
          </div>
        ))}
      </div>

      {/* Windows Manager Overlay */}
      {windows.map((win) => {
        if (win.id === "gta-vice-city") {
          return null;
        }
        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isMaximized={win.isMaximized}
            isActive={win.isActive}
            zIndex={win.zIndex}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            initialX={win.x}
            initialY={win.y}
            width={win.width}
            height={win.height}
            icon={win.icon}
            menuItems={
              win.id === "url-shortener"
                ? [
                  {
                    label: "File",
                    items: [
                      { label: "Open History Database", onClick: () => focusWindow("url-shortener") },
                      { label: "Close Shortener", onClick: () => closeWindow("url-shortener") },
                    ],
                  },
                  {
                    label: "Help",
                    items: [
                      { label: "Show System Specs", onClick: () => openApp("my-computer") },
                      { label: "View Readme Documentation", onClick: () => openApp("readme") },
                    ],
                  },
                ]
                : win.id === "readme"
                  ? [
                    {
                      label: "File",
                      items: [{ label: "Close Notepad", onClick: () => closeWindow("readme") }],
                    },
                  ]
                  : win.id === "recycle-bin"
                    ? [
                      {
                        label: "File",
                        items: [
                          { label: "Empty Recycle Bin", onClick: handleEmptyRecycleBin },
                          { label: "Close Bin", onClick: () => closeWindow("recycle-bin") },
                        ],
                      },
                    ]
                    : undefined
            }
          >
            {/* App Router client components injection */}
            {win.id === "welcome" && (
              <div className="flex flex-col h-full bg-[#dfdfdf] p-4 text-xs justify-between select-none text-black">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center p-2 bg-[#c0c0c0] border-win-out w-20 h-20 shrink-0">
                    <span className="text-4xl">👋</span>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-sm font-bold">Welcome to the URL Shortener OS!</h2>
                    <p className="text-zinc-700 leading-normal">
                      This developer showcase replicates the Microsoft Windows 98 desktop environment.
                    </p>
                    <p className="text-zinc-800 leading-normal font-semibold">
                      For the most immersive, pixel-perfect, and authentic experience, we highly recommend switching your browser to full screen mode.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={() => {
                      if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch((err) => {
                          console.error(err);
                        });
                      }
                      closeWindow("welcome");
                    }}
                    className="border-win-button py-2 px-4 font-bold text-center active:border-win-button-depressed outline-none flex items-center justify-center gap-2 hover:bg-[#c0c0c0] text-sm"
                  >
                    🖥️ Go Fullscreen Now
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-400 pt-3 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={showWelcomeCheckbox}
                      onChange={(e) => {
                        setShowWelcomeCheckbox(e.target.checked);
                        localStorage.setItem("show_welcome_screen", e.target.checked ? "true" : "false");
                      }}
                      className="cursor-pointer"
                    />
                    <span>Show this screen at startup</span>
                  </label>

                  <button
                    onClick={() => closeWindow("welcome")}
                    className="border-win-button px-5 py-1 font-bold active:border-win-button-depressed outline-none text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            {win.id === "url-shortener" && (
              <UrlShortenerApp
                onAddToRecycleBin={handleAddToRecycleBin}
                historyRefreshTrigger={historyTrigger}
                onStorageLimitReached={() => openApp("storage-error")}
              />
            )}
            {win.id === "readme" && <NotepadApp />}
            {win.id === "paint" && <PaintApp />}
            {win.id === "gta-vice-city" && <GtaViceCityApp />}
            {win.id === "my-computer" && <MyComputerApp />}
            {win.id === "storage-error" && (
              <div className="flex flex-col h-full justify-between p-3 select-none text-black bg-[#c0c0c0] font-win-sans">
                <div className="flex gap-4 items-center mt-1">
                  {/* Red cross circle error icon */}
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-xl font-bold font-win-mono shadow-md border-win-out-thin select-none shrink-0">
                    X
                  </div>
                  <div className="flex-1 text-xs">
                    <h3 className="font-bold mb-1">Local Disk (C:) Storage Full</h3>
                    <p className="text-zinc-800">
                      The URL Shortener database has reached the limit of 5 links (25.0 GB used of 25.0 GB allocated).
                    </p>
                    <p className="text-zinc-800 mt-1">
                      Delete existing links or empty the Recycle Bin to free up space.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => closeWindow("storage-error")}
                  className="border-win-button font-bold py-1 px-8 active:border-win-button-depressed outline-none self-center text-xs mt-3.5"
                >
                  OK
                </button>
              </div>
            )}
            {win.id === "gta-graphic-error" && (
              <div className="flex flex-col h-full justify-between p-3 select-none text-black bg-[#c0c0c0] font-win-sans">
                <div className="flex gap-4 items-center mt-1">
                  {/* Red cross circle error icon */}
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-xl font-bold font-win-mono shadow-md border-win-out-thin select-none shrink-0">
                    X
                  </div>
                  <div className="flex-1 text-xs">
                    <h3 className="font-bold mb-1">Fatal Error</h3>
                    <p className="text-zinc-800">
                      graphic card not supported
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => closeWindow("gta-graphic-error")}
                  className="border-win-button font-bold py-1 px-8 active:border-win-button-depressed outline-none self-center text-xs mt-3"
                >
                  OK
                </button>
              </div>
            )}
            {win.id === "gta-loader" && (
              <div className="flex flex-col h-full justify-between p-4 select-none text-black bg-[#c0c0c0] font-win-sans">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Updating...</span>
                    <span>{videoDownloadPercent}%</span>
                  </div>
                  {/* Retro Windows 98 Setup progress bar */}
                  <div className="w-full h-5 bg-white border-win-in p-[2px] flex items-center">
                    <div 
                      className="h-full bg-[#000080]" 
                      style={{ width: `${videoDownloadPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-700 mt-1">
                    Copying file: GTA_INDIA.mp4 to Local Disk (C:\)
                  </span>
                </div>
                <button
                  onClick={() => closeWindow("gta-loader")}
                  className="border-win-button px-6 py-1 active:border-win-button-depressed outline-none self-end text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
            {win.id === "recycle-bin" && (
              <div className="flex flex-col h-full bg-[#c0c0c0] font-win-sans text-black select-none">
                {/* Toolbar */}
                <div className="flex gap-2 border-b border-[#808080] pb-2 mb-2 px-1 text-xs">
                  <button
                    onClick={handleEmptyRecycleBin}
                    disabled={deletedLinks.length === 0}
                    className="border-win-button px-3 py-1 font-bold flex items-center gap-1 active:border-win-button-depressed outline-none disabled:opacity-50"
                  >
                    <Trash2 size={12} /> Empty Recycle Bin
                  </button>
                </div>

                {/* Items List */}
                <div className="flex-1 bg-white border-win-in overflow-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#dfdfdf] border-b border-[#808080] sticky top-0 font-bold">
                        <th className="px-2 py-1.5 border-r border-[#808080]">Name</th>
                        <th className="px-2 py-1.5 border-r border-[#808080]">Original Location</th>
                        <th className="px-2 py-1.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deletedLinks.length > 0 ? (
                        deletedLinks.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-50 border-b border-zinc-200">
                            <td className="px-2 py-1.5 border-r font-win-mono truncate max-w-[120px]">
                              {item.short_code}
                            </td>
                            <td className="px-2 py-1.5 border-r font-win-mono text-zinc-600 truncate max-w-[200px]" title={item.original_url}>
                              {item.original_url}
                            </td>
                            <td className="px-2 py-1.5 text-center flex justify-center gap-2">
                              <button
                                onClick={() => handleRestoreLink(item)}
                                className="border-win-button px-2 py-0.5 text-[10px] font-bold flex items-center gap-0.5"
                                title="Restore link to active history"
                              >
                                <FolderSync size={10} /> Restore
                              </button>
                              <button
                                onClick={() => handlePermanentDelete(item.id)}
                                className="border-win-button px-2 py-0.5 text-[10px] font-bold text-red-700"
                                title="Delete permanently"
                              >
                                Destroy
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center py-12 text-zinc-400">
                            <div className="text-2xl mb-1">🗑️</div>
                            <div className="font-bold">Recycle Bin is empty.</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Window>
        )
      })}

      {windows.find((w) => w.id === "gta-vice-city")?.isOpen && (
        <div className="fixed inset-0 z-[9999999] bg-black select-none pointer-events-none cursor-none flex items-center justify-center">
          <GtaViceCityApp src={videoBlobUrl || undefined} onVideoEnd={handleGtaVideoEnd} />
        </div>
      )}

      {cheatNotification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#ff007f] text-white border-2 border-white px-6 py-2 z-[99999999] font-bold text-xs tracking-widest animate-pulse font-win-sans shadow-lg select-none">
          🌴 {cheatNotification}
        </div>
      )}

      {/* Taskbar & Start Menu */}
      <StartMenu
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        onOpenApp={openApp}
        onShutDown={triggerBsod}
      />
      <Taskbar
        windows={windows}
        isStartOpen={isStartOpen}
        onToggleStart={() => setIsStartOpen(!isStartOpen)}
        onToggleWindow={handleToggleWindow}
      />

      {/* Retro Right-Click Context Menu */}
      {contextMenu.visible && (
        <>
          <div
            onClick={() => setContextMenu({ ...contextMenu, visible: false })}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="fixed inset-0 z-[9999998] bg-transparent"
          />
          <div
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed w-[190px] bg-[#c0c0c0] border-win-out p-0.5 z-[9999999] select-none font-win-sans shadow-2xl text-black text-xs flex flex-col"
          >
            <button
              onClick={() => {
                setHistoryTrigger((p) => p + 1);
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default select-none outline-none flex items-center gap-2 border-b border-[#dfdfdf]"
            >
              <span>🔄</span> Refresh Desktop
            </button>
            <button
              onClick={() => {
                openApp("url-shortener");
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default select-none outline-none flex items-center gap-2"
            >
              <span>🔗</span> URL Shortener Wizard
            </button>
            <button
              onClick={() => {
                openApp("readme");
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default select-none outline-none flex items-center gap-2"
            >
              <span>📝</span> README.txt (Notepad)
            </button>
            <button
              onClick={() => {
                openApp("paint");
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default select-none outline-none flex items-center gap-2"
            >
              <span>🎨</span> MS Paint Drawing
            </button>
            <button
              onClick={() => {
                openApp("gta-vice-city");
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default select-none outline-none flex items-center gap-2"
            >
              <img src="https://cdn2.steamgriddb.com/icon/722caafb4825ef5d8670710fa29087cf/32/256x256.png" className="w-4 h-4 object-contain" alt="" /> Play GTA India
            </button>
            <button
              onClick={() => {
                openApp("my-computer");
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default select-none outline-none flex items-center gap-2"
            >
              <span>🖥️</span> System Properties
            </button>
            <button
              onClick={() => {
                openApp("recycle-bin");
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default select-none outline-none flex items-center gap-2 border-b border-[#808080]"
            >
              <span>🗑️</span> Recycle Bin
            </button>
            <button
              onClick={() => {
                handleEmptyRecycleBin();
                setContextMenu({ ...contextMenu, visible: false });
              }}
              disabled={deletedLinks.length === 0}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white disabled:hover:bg-[#c0c0c0] disabled:hover:text-zinc-500 disabled:opacity-50 cursor-default select-none outline-none flex items-center gap-2"
            >
              <span>🚮</span> Empty Recycle Bin
            </button>
            <button
              onClick={() => {
                handleClearDatabase();
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default select-none outline-none flex items-center gap-2 border-b border-[#808080]"
            >
              <span>🧹</span> Clear Shortener DB
            </button>
            <button
              onClick={() => {
                triggerBsod();
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default select-none outline-none flex items-center gap-2 text-red-800"
            >
              <span>🔌</span> Shut Down OS...
            </button>
          </div>
        </>
      )}
    </div>
  );
}

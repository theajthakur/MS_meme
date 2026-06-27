"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, ExternalLink, RefreshCw, Trash2 } from "lucide-react";

interface HistoryItem {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}

interface UrlShortenerAppProps {
  onAddToRecycleBin: (item: HistoryItem) => void;
  historyRefreshTrigger: number;
}

export default function UrlShortenerApp({ onAddToRecycleBin, historyRefreshTrigger }: UrlShortenerAppProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"shorten" | "history">("shorten");

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("url_shortener_history");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, [historyRefreshTrigger]);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("url_shortener_history", JSON.stringify(newHistory));
    // Trigger storage event so Recycle Bin can stay synced
    window.dispatchEvent(new Event("storage"));
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Add loading hourglass style to body temporarily
    document.body.classList.add("cursor-hourglass");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL. Please try again.");
      }

      // Fast API returns { "message": "Short URL created", "short_code": "...", "original_url": "..." }
      const newShortCode = data.short_code;
      const originalUrl = data.original_url || url.trim();

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        original_url: originalUrl,
        short_code: newShortCode,
        created_at: new Date().toLocaleString(),
        clicks: 0,
      };

      setResult(newHistoryItem);
      
      // Update history list
      const updatedHistory = [newHistoryItem, ...history.filter(h => h.original_url !== originalUrl)];
      saveHistory(updatedHistory);
      setUrl("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      document.body.classList.remove("cursor-hourglass");
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    const itemToDelete = history.find(h => h.id === id);
    if (itemToDelete) {
      onAddToRecycleBin(itemToDelete);
      const updated = history.filter(h => h.id !== id);
      saveHistory(updated);
    }
  };

  const simulateClick = (id: string, shortUrl: string) => {
    // Open shortened URL in a new window
    window.open(shortUrl, "_blank");
    // Update local clicks counter
    const updated = history.map(item => {
      if (item.id === id) {
        return { ...item, clicks: item.clicks + 1 };
      }
      return item;
    });
    saveHistory(updated);
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win-sans select-none text-black">
      {/* OS Tab Bar */}
      <div className="flex border-b border-[#808080] mb-3">
        <button
          onClick={() => setActiveTab("shorten")}
          className={`px-4 py-1.5 text-sm cursor-default border-t border-x rounded-t-md transition-all outline-none ${
            activeTab === "shorten"
              ? "bg-[#c0c0c0] border-t-white border-x-white font-bold -mb-[1px] z-10"
              : "bg-[#b0b0b0] border-t-transparent border-x-transparent text-[#505050] hover:bg-[#b8b8b8]"
          }`}
        >
          Shorten Link
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-1.5 text-sm cursor-default border-t border-x rounded-t-md transition-all outline-none ${
            activeTab === "history"
              ? "bg-[#c0c0c0] border-t-white border-x-white font-bold -mb-[1px] z-10"
              : "bg-[#b0b0b0] border-t-transparent border-x-transparent text-[#505050] hover:bg-[#b8b8b8]"
          }`}
        >
          Link Database ({history.length})
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex flex-col p-1">
        {activeTab === "shorten" ? (
          <div className="flex-1 flex flex-col justify-between">
            {/* Input Panel */}
            <div className="border-win-out p-4 bg-[#c0c0c0] space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>🔗</span> URL Shortener Wizard
              </h2>
              <p className="text-xs text-zinc-700 leading-normal">
                Welcome to the Internet Link Compressor. Paste your long, disorganized URL below to generate a short, clean, and fast alias redirect.
              </p>
              
              <form onSubmit={handleShorten} className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="url-input" className="text-xs font-bold">
                    Target Address (URL):
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="url-input"
                      type="url"
                      required
                      placeholder="https://example.com/very/long/and/complicated/url/here"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={loading}
                      className="flex-1 border-win-in bg-white px-3 py-1.5 text-sm font-win-mono outline-none text-black select-text"
                    />
                    <button
                      type="submit"
                      disabled={loading || !url.trim()}
                      className="border-win-button font-bold px-5 active:border-win-button-depressed flex items-center gap-1 min-w-[90px] justify-center"
                    >
                      {loading ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        "Compress"
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Error Dialogue */}
              {error && (
                <div className="border-win-out bg-[#c0c0c0] p-3 flex gap-3 items-start border-l-red-600 border-l-[6px]">
                  <div className="text-xl">⚠️</div>
                  <div className="flex-1">
                    <div className="font-bold text-xs">Error Shortening Address:</div>
                    <div className="text-xs text-zinc-800 mt-1 font-win-mono break-all">{error}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="mt-4 flex-1 border-win-in bg-[#dfdfdf] p-4 flex flex-col justify-center items-center relative overflow-hidden">
              {result ? (
                <div className="w-full max-w-md bg-white border-win-out p-4 flex flex-col gap-3 relative z-10 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-[#808080] pb-2">
                    <span className="text-xs font-bold text-[#000080]">SUCCESS - SHORT LINK GENERATED</span>
                    <span className="text-xs text-zinc-500 font-win-mono">{result.created_at.split(",")[0]}</span>
                  </div>

                  <div className="space-y-3">
                    {/* Shortened URL Row */}
                    <div>
                      <div className="text-xs font-bold text-zinc-600 mb-1">Short Address:</div>
                      <div className="flex gap-2">
                        <div className="flex-1 border-win-in bg-zinc-50 px-2.5 py-1 text-sm font-bold font-win-mono text-[#000080] break-all select-text">
                          {result.short_code}
                        </div>
                        <button
                          onClick={() => handleCopy(result.short_code, "res")}
                          className="border-win-button px-3 py-1 flex items-center justify-center hover:bg-zinc-100"
                          title="Copy Link"
                        >
                          {copiedId === "res" ? (
                            <Check size={14} className="text-green-700 stroke-[3px]" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => simulateClick(result.id, result.short_code)}
                          className="border-win-button px-3 py-1 flex items-center justify-center"
                          title="Test / Visit Link"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Original URL Row */}
                    <div>
                      <div className="text-xs font-bold text-zinc-600 mb-1">Destination Address:</div>
                      <div className="border-win-in bg-zinc-50 px-2.5 py-1 text-xs font-win-mono text-zinc-700 break-all max-h-[60px] overflow-y-auto select-text">
                        {result.original_url}
                      </div>
                    </div>

                    {/* QR Code Mock */}
                    <div className="flex items-center gap-4 border-t border-dashed border-[#808080] pt-3">
                      {/* Pixelated QR code block */}
                      <div className="w-[80px] h-[80px] border-win-in bg-white flex flex-wrap p-1 select-none">
                        {Array.from({ length: 16 }).map((_, r) => (
                          <div key={r} className="w-full flex">
                            {Array.from({ length: 16 }).map((_, c) => {
                              const isBlack = (r + c) % 2 === 0 || (r * c) % 3 === 0 || (r < 4 && c < 4) || (r > 11 && c < 4) || (r < 4 && c > 11);
                              return (
                                <div
                                  key={c}
                                  className={`w-[4.5px] h-[4.5px] ${isBlack ? "bg-black" : "bg-white"}`}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-xs font-bold text-black">Scan QR Code</div>
                        <div className="text-[10px] text-zinc-600 leading-tight">
                          This pixelated bar-code contains the shortened link. Scan with your mobile camera to test redirect speed.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-zinc-500 space-y-2 select-none">
                  <div className="text-4xl filter grayscale opacity-40">🗜️</div>
                  <div className="text-xs font-bold">Compressor Status: Idle</div>
                  <div className="text-[11px] max-w-xs text-zinc-600 leading-normal">
                    Enter a long hyperlink in the wizard above and click "Compress" to activate the link database engine.
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Link Database/History Tab */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 border-win-in bg-white overflow-auto">
              <table className="w-full text-left border-collapse font-win-sans text-xs">
                <thead>
                  <tr className="bg-[#dfdfdf] border-b border-[#808080] sticky top-0 z-10 text-black">
                    <th className="px-3 py-2 border-r border-[#808080] font-bold">Date Created</th>
                    <th className="px-3 py-2 border-r border-[#808080] font-bold">Shortened URL</th>
                    <th className="px-3 py-2 border-r border-[#808080] font-bold">Original Destination</th>
                    <th className="px-3 py-2 border-r border-[#808080] font-bold text-center">Clicks</th>
                    <th className="px-3 py-2 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50 group text-black">
                        <td className="px-3 py-2 border-r border-zinc-200 whitespace-nowrap text-zinc-600 font-win-mono">
                          {item.created_at.split(",")[0]}
                        </td>
                        <td className="px-3 py-2 border-r border-zinc-200 font-bold font-win-mono text-[#000080] break-all select-text">
                          {item.short_code}
                        </td>
                        <td className="px-3 py-2 border-r border-zinc-200 font-win-mono text-zinc-700 truncate max-w-[200px] select-text" title={item.original_url}>
                          {item.original_url}
                        </td>
                        <td className="px-3 py-2 border-r border-zinc-200 text-center font-win-mono font-bold">
                          {item.clicks}
                        </td>
                        <td className="px-3 py-2 text-center flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleCopy(item.short_code, item.id)}
                            className="border-win-button p-1 flex items-center justify-center hover:bg-zinc-100"
                            title="Copy short link"
                          >
                            {copiedId === item.id ? (
                              <Check size={12} className="text-green-700 stroke-[3px]" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                          
                          <button
                            onClick={() => simulateClick(item.id, item.short_code)}
                            className="border-win-button p-1 flex items-center justify-center hover:bg-zinc-100"
                            title="Open short link"
                          >
                            <ExternalLink size={12} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="border-win-button p-1 flex items-center justify-center hover:bg-red-50 text-red-700"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-zinc-400">
                        <div className="text-3xl mb-2">📁</div>
                        <div className="font-bold text-xs">No records found in database</div>
                        <div className="text-[11px] text-zinc-500 mt-1">
                          Create some links to populate the tracking database.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Status bar */}
            <div className="border-win-in mt-2 p-1.5 text-[11px] flex justify-between bg-[#c0c0c0] font-win-sans">
              <div>Total links in database: {history.length}</div>
              <div className="font-win-mono text-zinc-600">DB Status: ONLINE</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

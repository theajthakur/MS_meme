"use client";

import React, { useState, useEffect } from "react";
import ShortenPanel from "./url-shortener/ShortenPanel";
import LinkDatabaseTable from "./url-shortener/LinkDatabaseTable";
import LinkDetailModal from "./url-shortener/LinkDetailModal";
import { HistoryItem } from "./url-shortener/types";
import { getAnalyticsClient, AnalyticsResponse } from "@/lib/shortener";
import Win98TabBar from "../ui/Win98TabBar";
import { useCopy } from "../ui/CopyButton";

interface UrlShortenerAppProps {
  onAddToRecycleBin: (item: HistoryItem) => void;
  historyRefreshTrigger: number;
  onStorageLimitReached: () => void;
}

const TABS = [
  { id: "shorten", label: "Shorten Link" },
  { id: "history", label: "" }, // label injected dynamically below
];

export default function UrlShortenerApp({
  onAddToRecycleBin,
  historyRefreshTrigger,
  onStorageLimitReached,
}: UrlShortenerAppProps) {
  // ── Form state ─────────────────────────────────────────────────────────────
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("shorten");

  // ── History ─────────────────────────────────────────────────────────────────
  const [history, setHistory] = useState<HistoryItem[]>([]);

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
    window.dispatchEvent(new Event("storage"));
  };

  // ── Copy ────────────────────────────────────────────────────────────────────
  const { copiedId, handleCopy } = useCopy();

  // ── Modal ───────────────────────────────────────────────────────────────────
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [modalAnalytics, setModalAnalytics] = useState<AnalyticsResponse | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const openDetail = async (item: HistoryItem) => {
    setSelectedItem(item);
    setModalAnalytics(null);
    setModalError(null);
    setModalLoading(true);
    try {
      const data = await getAnalyticsClient(item.short_code);
      setModalAnalytics(data);
    } catch (err: any) {
      setModalError(err.message || "Failed to load analytics.");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalAnalytics(null);
    setModalError(null);
  };

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (history.length >= 5) {
      setError(
        "Full Storage Error: Limit of 5 links reached (25.0 GB used). Delete some database links to free up storage space."
      );
      onStorageLimitReached();
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    document.body.classList.add("cursor-hourglass");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to shorten URL. Please try again.");

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        original_url: data.original_url || url.trim(),
        short_code: data.short_code,
        created_at: new Date().toLocaleString(),
        clicks: 0,
      };

      setResult(newItem);
      saveHistory([newItem, ...history.filter((h) => h.original_url !== newItem.original_url)]);
      setUrl("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      document.body.classList.remove("cursor-hourglass");
    }
  };

  const handleDelete = (id: string) => {
    const item = history.find((h) => h.id === id);
    if (item) {
      onAddToRecycleBin(item);
      saveHistory(history.filter((h) => h.id !== id));
    }
  };

  const handleVisit = (id: string, shortUrl: string) => {
    window.open(shortUrl, "_blank");
    saveHistory(history.map((item) => (item.id === id ? { ...item, clicks: item.clicks + 1 } : item)));
  };

  // Dynamic tab labels
  const tabs = [
    { id: "shorten", label: "Shorten Link" },
    { id: "history", label: `Link Database (${history.length})` },
  ];

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win-sans select-none text-black">
      {/* Link detail modal (portal) */}
      {selectedItem && (
        <LinkDetailModal
          item={selectedItem}
          analytics={modalAnalytics}
          loadingAnalytics={modalLoading}
          analyticsError={modalError}
          onClose={closeModal}
          copiedId={copiedId}
          onCopy={handleCopy}
        />
      )}

      {/* Tab bar */}
      <div className="mb-3">
        <Win98TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto flex flex-col p-1">
        {activeTab === "shorten" ? (
          <ShortenPanel
            url={url}
            loading={loading}
            error={error}
            result={result}
            copiedId={copiedId}
            onUrlChange={setUrl}
            onSubmit={handleShorten}
            onCopy={handleCopy}
            onVisit={handleVisit}
          />
        ) : (
          <LinkDatabaseTable
            history={history}
            copiedId={copiedId}
            onCopy={handleCopy}
            onVisit={handleVisit}
            onDelete={handleDelete}
            onRowClick={openDetail}
          />
        )}
      </div>
    </div>
  );
}

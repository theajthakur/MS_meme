"use client";

import React from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import QRCode from "react-qr-code";
import CopyButton from "../../ui/CopyButton";
import { HistoryItem } from "./types";

interface ShortenPanelProps {
  url: string;
  loading: boolean;
  error: string | null;
  result: HistoryItem | null;
  copiedId: string | null;
  onUrlChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCopy: (text: string, id: string) => void;
  onVisit: (id: string, shortUrl: string) => void;
}

/**
 * The "Shorten Link" tab panel — contains the input form, error banner,
 * and the result card with QR code.
 */
export default function ShortenPanel({
  url,
  loading,
  error,
  result,
  copiedId,
  onUrlChange,
  onSubmit,
  onCopy,
  onVisit,
}: ShortenPanelProps) {
  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Input Panel */}
      <div className="border-win-out p-4 bg-[#c0c0c0] space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <span>🔗</span> URL Shortener Wizard
        </h2>
        <p className="text-xs text-zinc-700 leading-normal">
          Welcome to the Internet Link Compressor. Paste your long, disorganized URL below to
          generate a short, clean, and fast alias redirect.
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
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
                onChange={(e) => onUrlChange(e.target.value)}
                disabled={loading}
                className="flex-1 border-win-in bg-white px-3 py-1.5 text-sm font-win-mono outline-none text-black select-text"
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="border-win-button font-bold px-5 active:border-win-button-depressed flex items-center gap-1 min-w-[90px] justify-center"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : "Compress"}
              </button>
            </div>
          </div>
        </form>

        {/* Error banner */}
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

      {/* Result area */}
      <div className="mt-4 flex-1 border-win-in bg-[#dfdfdf] p-4 flex flex-col justify-center items-center relative overflow-hidden">
        {result ? (
          <div className="w-full max-w-md bg-white border-win-out p-4 flex flex-col gap-3 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#808080] pb-2">
              <span className="text-xs font-bold text-[#000080]">SUCCESS - SHORT LINK GENERATED</span>
              <span className="text-xs text-zinc-500 font-win-mono">
                {result.created_at.split(",")[0]}
              </span>
            </div>

            <div className="space-y-3">
              {/* Short URL row */}
              <div>
                <div className="text-xs font-bold text-zinc-600 mb-1">Short Address:</div>
                <div className="flex gap-2">
                  <div className="flex-1 border-win-in bg-zinc-50 px-2.5 py-1 text-sm font-bold font-win-mono text-[#000080] break-all select-text">
                    {result.short_code}
                  </div>
                  <CopyButton
                    text={result.short_code}
                    copyId="res"
                    activeCopiedId={copiedId}
                    onCopy={onCopy}
                    size={14}
                    className="px-3 py-1"
                  />
                  <button
                    onClick={() => onVisit(result.id, result.short_code)}
                    className="border-win-button px-3 py-1 flex items-center justify-center"
                    title="Test / Visit Link"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Original URL */}
              <div>
                <div className="text-xs font-bold text-zinc-600 mb-1">Destination Address:</div>
                <div className="border-win-in bg-zinc-50 px-2.5 py-1 text-xs font-win-mono text-zinc-700 break-all max-h-[60px] overflow-y-auto select-text">
                  {result.original_url}
                </div>
              </div>

              {/* QR code */}
              <div className="flex items-center gap-4 border-t border-dashed border-[#808080] pt-3">
                <div className="w-[80px] h-[80px] border-win-in bg-white p-1 select-none flex items-center justify-center">
                  <QRCode
                    size={70}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={result.short_code}
                    viewBox="0 0 70 70"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-bold text-black">Scan QR Code</div>
                  <div className="text-[10px] text-zinc-600 leading-tight">
                    Scan this code with your mobile camera to instantly access the shortened redirect address.
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
              Enter a long hyperlink in the wizard above and click "Compress" to activate the link
              database engine.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

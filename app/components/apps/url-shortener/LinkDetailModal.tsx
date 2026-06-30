"use client";

import React from "react";
import { BarChart2, ExternalLink, RefreshCw, Eye } from "lucide-react";
import QRCode from "react-qr-code";
import Win98Modal from "../../ui/Win98Modal";
import CopyButton from "../../ui/CopyButton";
import { HistoryItem } from "./types";
import { AnalyticsResponse } from "../../../../lib/shortener";

interface LinkDetailModalProps {
  item: HistoryItem;
  analytics: AnalyticsResponse | null;
  loadingAnalytics: boolean;
  analyticsError: string | null;
  onClose: () => void;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

export default function LinkDetailModal({
  item,
  analytics,
  loadingAnalytics,
  analyticsError,
  onClose,
  copiedId,
  onCopy,
}: LinkDetailModalProps) {
  return (
    <Win98Modal
      icon={<BarChart2 size={12} />}
      title={`Link Detail — ${item.short_code}`}
      onClose={onClose}
    >
      {/* Short code + destination */}
      <div className="border-win-out bg-[#dfdfdf] p-3 space-y-2">
        <div className="font-bold text-[#000080] text-sm">{item.short_code}</div>
        <div className="font-win-mono text-zinc-600 break-all text-[11px]">
          {item.original_url}
        </div>
        <div className="flex gap-2 pt-1">
          <CopyButton
            text={item.short_code}
            copyId="modal-copy"
            activeCopiedId={copiedId}
            onCopy={onCopy}
            size={12}
            label="Copy Link"
          />
          <button
            onClick={() => window.open(item.short_code, "_blank")}
            className="border-win-button px-3 py-1 flex items-center gap-1.5 justify-center hover:bg-zinc-100 text-xs"
          >
            <ExternalLink size={12} />
            Visit
          </button>
        </div>
      </div>

      {/* Local stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="border-win-in bg-white p-2.5 flex flex-col gap-1">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
            Created
          </div>
          <div className="font-win-mono text-black text-xs">{item.created_at}</div>
        </div>
        <div className="border-win-in bg-white p-2.5 flex flex-col gap-1">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
            Local Clicks
          </div>
          <div className="font-win-mono text-black text-xs font-bold">{item.clicks}</div>
        </div>
      </div>

      {/* Backend analytics */}
      <div className="border-win-out bg-[#c0c0c0] p-3">
        <div className="font-bold mb-2 flex items-center gap-1.5">
          <Eye size={11} />
          Backend Analytics
        </div>
        {loadingAnalytics ? (
          <div className="flex items-center gap-1.5 text-zinc-600">
            <RefreshCw size={11} className="animate-spin" />
            <span>Fetching analytics…</span>
          </div>
        ) : analyticsError ? (
          <div className="text-red-700 font-win-mono text-[10px]">⚠ {analyticsError}</div>
        ) : analytics ? (
          <div className="border-win-in bg-white p-3 flex items-center gap-3">
            <div className="font-win-mono text-[#000080] text-2xl font-bold leading-none">
              {analytics.clickCount}
            </div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide leading-tight">
              Total<br />Clicks
            </div>
          </div>
        ) : null}
      </div>

      {/* QR code */}
      <div className="flex items-center gap-4 border-t border-dashed border-[#808080] pt-3">
        <div className="w-[64px] h-[64px] border-win-in bg-white p-1 flex items-center justify-center">
          <QRCode
            size={56}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={item.short_code}
            viewBox="0 0 56 56"
          />
        </div>
        <div className="flex-1 text-[10px] text-zinc-600 leading-relaxed">
          Scan this QR code with a mobile device to visit the shortened link directly.
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-1">
        <button
          onClick={onClose}
          className="border-win-button px-6 py-1 text-xs font-bold active:border-win-button-depressed"
        >
          Close
        </button>
      </div>
    </Win98Modal>
  );
}

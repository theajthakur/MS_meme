"use client";

import React from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import CopyButton from "../../ui/CopyButton";
import { HistoryItem } from "./types";

interface LinkDatabaseTableProps {
  history: HistoryItem[];
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onVisit: (id: string, shortUrl: string) => void;
  onDelete: (id: string) => void;
  onRowClick: (item: HistoryItem) => void;
}

/**
 * The "Link Database" tab panel — history table with copy, visit, delete actions.
 * Click a row to open the link detail modal (handled by parent via onRowClick).
 */
export default function LinkDatabaseTable({
  history,
  copiedId,
  onCopy,
  onVisit,
  onDelete,
  onRowClick,
}: LinkDatabaseTableProps) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 border-win-in bg-white overflow-auto">
        <table className="w-full text-left border-collapse font-win-sans text-xs">
          <thead>
            <tr className="bg-[#dfdfdf] border-b border-[#808080] sticky top-0 z-10 text-black">
              <th className="px-3 py-2 border-r border-[#808080] font-bold">Date Created</th>
              <th className="px-3 py-2 border-r border-[#808080] font-bold">Shortened URL</th>
              <th className="px-3 py-2 border-r border-[#808080] font-bold">Original Destination</th>
              <th className="px-3 py-2 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {history.length > 0 ? (
              history.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#e8e8ff] group text-black cursor-pointer"
                  onClick={() => onRowClick(item)}
                  title="Click to view link details"
                >
                  <td className="px-3 py-2 border-r border-zinc-200 whitespace-nowrap text-zinc-600 font-win-mono">
                    {item.created_at.split(",")[0]}
                  </td>
                  <td className="px-3 py-2 border-r border-zinc-200 font-bold font-win-mono text-[#000080] break-all select-text">
                    {item.short_code}
                  </td>
                  <td
                    className="px-3 py-2 border-r border-zinc-200 font-win-mono text-zinc-700 truncate max-w-[200px] select-text"
                    title={item.original_url}
                  >
                    {item.original_url}
                  </td>
                  <td
                    className="px-3 py-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <CopyButton
                        text={item.short_code}
                        copyId={item.id}
                        activeCopiedId={copiedId}
                        onCopy={onCopy}
                        size={12}
                        className="p-1"
                      />
                      <button
                        onClick={() => onVisit(item.id, item.short_code)}
                        className="border-win-button p-1 flex items-center justify-center hover:bg-zinc-100"
                        title="Open short link"
                      >
                        <ExternalLink size={12} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="border-win-button p-1 flex items-center justify-center hover:bg-red-50 text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-12 text-zinc-400">
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
  );
}

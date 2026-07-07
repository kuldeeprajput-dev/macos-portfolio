import React from "react";
import { Play, Clock } from "lucide-react";

const colors = [
  "from-indigo-600 to-pink-500",
  "from-yellow-400 to-amber-600",
  "from-red-600 to-rose-900",
  "from-zinc-500 to-slate-700",
  "from-neutral-900 to-zinc-950",
  "from-blue-600 to-indigo-950",
  "from-orange-500 to-amber-500",
  "from-emerald-500 to-teal-700",
];

export const getCoverColor = (index) => colors[index % colors.length];

const emojis = ["🌌", "🤖", "🕶️", "☁️", "✖️", "✨", "🪕", "🪈", "🥁", "🎵", "🎸", "🎹", "🎶"];
export const getCoverEmoji = (name) => {
  const code = (name && name.charCodeAt(0)) || 0;
  return emojis[code % emojis.length];
};

export const TracksTable = React.memo(
  ({ tracks, activeTrackId, isPlaying, onSelectTrack, formatTime, isNarrow }) => {
    return (
      <table className="w-full text-left border-collapse table-fixed">
        <thead>
          <tr className="border-b border-zinc-100 text-[10px] font-bold text-gray-400 uppercase select-none">
            <th className="py-2.5 px-4 w-12">#</th>
            <th className="py-2.5 px-3">Title</th>
            {!isNarrow && <th className="py-2.5 px-3 w-1/4">Artist</th>}
            {!isNarrow && <th className="py-2.5 px-3 w-1/4">Album</th>}
            <th className="py-2.5 px-3 w-16 text-center">
              <Clock size={12} className="inline" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50 text-xs">
          {tracks.map((track, index) => {
            const isActive = activeTrackId === track.id;
            return (
              <tr
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className={`hover:bg-zinc-50 cursor-pointer group ${
                  isActive ? "bg-red-50/50 font-semibold" : ""
                }`}
              >
                <td className="py-3 px-4 text-gray-400">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {isActive && isPlaying ? (
                      <div className="flex items-center gap-0.5 justify-center w-4 h-4">
                        <span
                          className="w-0.5 h-3 bg-red-500 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-0.5 h-3 bg-red-500 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-0.5 h-3 bg-red-500 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    ) : (
                      <>
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play
                          size={12}
                          className="hidden group-hover:block text-red-500 transition-transform active:scale-95"
                        />
                      </>
                    )}
                  </div>
                </td>
                <td
                  className={`py-3 px-3 max-w-0 truncate ${isActive ? "text-red-600" : "text-gray-900"}`}
                >
                  <div className="truncate font-semibold">{track.title}</div>
                  {isNarrow && (
                    <div className="text-[10px] text-gray-400 truncate mt-0.5 font-normal">
                      {track.artist}
                    </div>
                  )}
                </td>
                {!isNarrow && <td className="py-3 px-3 text-gray-600 truncate">{track.artist}</td>}
                {!isNarrow && <td className="py-3 px-3 text-gray-500 truncate">{track.album}</td>}
                <td className="py-3 px-3 text-gray-400 text-center font-mono">
                  {formatTime(track.duration)}
                </td>
              </tr>
            );
          })}

          {tracks.length === 0 && (
            <tr>
              <td colSpan={isNarrow ? "3" : "5"} className="text-center py-12 text-gray-400 italic">
                No songs found in this view
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  },
);

TracksTable.displayName = "TracksTable";

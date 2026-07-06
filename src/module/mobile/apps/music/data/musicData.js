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

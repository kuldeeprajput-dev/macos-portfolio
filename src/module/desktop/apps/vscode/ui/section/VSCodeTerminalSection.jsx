import { Play, Terminal as TerminalIcon } from "lucide-react";

const VSCodeTerminalSection = ({
  isTerminalOpen,
  onToggleTerminal,
  terminalHistory,
  terminalInput,
  setTerminalInput,
  terminalBottomRef,
  runCommand,
  isNarrow,
  terminalHeight,
}) => {
  if (!isTerminalOpen) return null;

  return (
    <div
      style={{ height: `${terminalHeight}px` }}
      className="bg-[#ffffff] border-t border-[#e5e5e5] flex flex-col shrink-0 select-none"
    >
      <div className="bg-[#f3f3f3] px-4 py-1.5 border-b border-[#e5e5e5] flex items-center justify-between text-[11px] text-[#333333]">
        <div className="flex items-center gap-4 font-semibold">
          {!isNarrow && (
            <>
              <span className="hover:text-black cursor-pointer animate-fade-in">Problems</span>
              <span className="hover:text-black cursor-pointer animate-fade-in">Output</span>
              <span className="hover:text-black cursor-pointer animate-fade-in">Debug Console</span>
            </>
          )}
          <span className="text-[#333333] border-b-2 border-[#007acc] pb-0.5 cursor-pointer font-bold">
            Terminal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Play size={12} className="text-green-600 cursor-pointer" />
          <button
            onClick={onToggleTerminal}
            className="focus:outline-none cursor-pointer hover:text-black"
          >
            <TerminalIcon size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] select-text bg-[#ffffff]">
        <div className="space-y-1">
          {terminalHistory.map((item, idx) => (
            <div
              key={idx}
              className={
                item.type === "input" ? "text-[#0451a5] font-bold" : "text-[#333333] leading-normal"
              }
            >
              {item.type === "input" ? `➜ /workspace $ ${item.text}` : item.text}
            </div>
          ))}
          <div ref={terminalBottomRef} />
        </div>
      </div>

      <div className="bg-[#f3f3f3] px-3 py-1 flex items-center gap-2 border-t border-[#e5e5e5] shrink-0">
        <span className="text-[#0451a5] font-bold font-mono text-xs">➜ /workspace $</span>
        <input
          type="text"
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              runCommand(terminalInput);
              setTerminalInput("");
            }
          }}
          placeholder={
            isNarrow ? "Type command..." : "type 'help' for available workspace commands..."
          }
          className="flex-1 bg-transparent border-none outline-none text-[#333333] text-xs font-mono select-text"
        />
      </div>
    </div>
  );
};

export default VSCodeTerminalSection;

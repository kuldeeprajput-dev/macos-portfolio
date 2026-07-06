import { X, Phone, Video, Trash2 } from "lucide-react";
import { DIALPAD_KEYS } from "../../data";

const CallDialPad = ({
  dialNumber,
  onDialPress,
  onBackspace,
  onClear,
  onInitiateCall,
  onInputChange,
}) => {
  return (
    <div className="flex-1 flex flex-col p-4 justify-between min-h-0 overflow-y-auto thin-scrollbar bg-white">
      <div className="flex items-center justify-between bg-zinc-100 border border-zinc-200/50 rounded-xl p-3 mb-4 shrink-0">
        <input
          type="text"
          value={dialNumber}
          onChange={(e) => {
            const val = e.target.value;
            if (/^[0-9*#+]*$/.test(val)) {
              onInputChange(val);
            }
          }}
          placeholder="Enter number"
          className="w-full bg-transparent font-bold text-base text-center outline-none border-none text-zinc-800 tracking-wide placeholder-zinc-400"
        />
        {dialNumber && (
          <button
            onClick={onBackspace}
            className="p-1 hover:bg-zinc-200 rounded-full text-zinc-500"
            title="Backspace"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3.5 w-full max-w-[210px] mx-auto">
        {DIALPAD_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => onDialPress(key)}
            className="aspect-square rounded-full bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 flex items-center justify-center transition-all select-none border border-zinc-200/40 shadow-sm text-lg font-bold text-zinc-800"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 pt-6 shrink-0">
        <button
          onClick={() => {
            if (dialNumber) {
              onInitiateCall(dialNumber, "audio");
            }
          }}
          disabled={!dialNumber}
          className="w-12 h-12 bg-zinc-100 hover:bg-zinc-200 active:scale-95 disabled:opacity-30 rounded-full flex items-center justify-center text-zinc-700 transition-all shadow-md"
          title="Audio FaceTime"
        >
          <Phone
            className={`w-5 h-5 ${dialNumber ? "fill-zinc-700 text-transparent" : "fill-zinc-300 text-transparent"}`}
          />
        </button>
        <button
          onClick={() => {
            if (dialNumber) {
              onInitiateCall(dialNumber, "video");
            }
          }}
          disabled={!dialNumber}
          className="w-12 h-12 bg-[#30d158] hover:bg-[#2cb84e] active:scale-95 disabled:opacity-30 rounded-full flex items-center justify-center text-white transition-all shadow-md shadow-green-500/10"
          title="Video FaceTime"
        >
          <Video
            className={`w-5 h-5 ${dialNumber ? "fill-white text-transparent" : "fill-zinc-300 text-transparent"}`}
          />
        </button>
        {dialNumber && (
          <button
            onClick={onClear}
            className="p-3.5 bg-red-100 hover:bg-red-200 rounded-full text-red-500 transition-colors"
            title="Clear All"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CallDialPad;

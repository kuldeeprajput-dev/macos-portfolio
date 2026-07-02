import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import TextEditor from "./TextEditor";

const Text = () => {
  const { windows } = useWindowsStore();
  const data = windows.txtfile?.data;
  const { name = "Document", image = "", subtitle = "", description = [] } = data || {};

  return (
    <div className="flex flex-col h-full w-full bg-[#f2f2f7] overflow-hidden">
      <div
        id="window-header"
        className="shrink-0 bg-white/80 backdrop-blur-md border-b border-zinc-200/50 px-4 py-2 flex items-center justify-between z-20 relative"
      >
        <WindowControls target={"txtfile"} />
        <h2 className="text-xs font-bold text-zinc-800 absolute left-1/2 -translate-x-1/2 pointer-events-none">
          {name}
        </h2>
        <div className="w-[60px]" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <TextEditor image={image} name={name} subtitle={subtitle} description={description} />
      </div>
    </div>
  );
};

const TextWindow = windowWrapper(Text, "txtfile");
export default TextWindow;

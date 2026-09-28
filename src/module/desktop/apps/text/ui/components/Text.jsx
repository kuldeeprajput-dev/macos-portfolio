import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import TextEditor from "./TextEditor";

const Text = () => {
  const { windows } = useWindowsStore();
  const data = windows.txtfile?.data;
  const { name = "Document", image = "", subtitle = "", description = [] } = data || {};

  return (
    <div className="flex flex-col h-full w-full @container bg-white rounded-xl overflow-hidden">
      <div
        id="window-header"
        className="shrink-0 !bg-gray-50 !border-b-[#d1d1d1] !px-4 !py-2 flex items-center justify-between"
      >
        <WindowControls target={"txtfile"} />
        <h2 className="flex-1 text-center font-bold text-gray-500">{name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 thin-scrollbar select-text">
        <TextEditor image={image} name={name} subtitle={subtitle} description={description} />
      </div>
    </div>
  );
};

const TextWindow = windowWrapper(Text, "txtfile");
export default TextWindow;

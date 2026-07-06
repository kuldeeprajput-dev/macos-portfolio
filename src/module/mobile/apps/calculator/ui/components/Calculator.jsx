import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import useCalculator from "../../hooks/useCalculator";
import CalculatorDisplay from "./CalculatorDisplay";
import CalculatorKeypad from "./CalculatorKeypad";

const Calculator = () => {
  const {
    value,
    displayValue,
    operator,
    clearAll,
    clearDisplay,
    toggleSign,
    inputPercent,
    inputDigit,
    inputDot,
    performOperation,
  } = useCalculator();

  return (
    <div className="flex flex-col h-full w-full bg-black rounded-xl overflow-hidden shadow-2xl select-none">
      <div id="window-header" className="shrink-0 flex items-center justify-between relative z-10">
        <WindowControls target="calculator" />
      </div>
      <div className="flex-1 flex flex-col justify-end p-4 pt-2 relative">
        <CalculatorDisplay value={value} operator={operator} displayValue={displayValue} />
        <CalculatorKeypad
          displayValue={displayValue}
          operator={operator}
          clearAll={clearAll}
          clearDisplay={clearDisplay}
          toggleSign={toggleSign}
          inputPercent={inputPercent}
          inputDigit={inputDigit}
          inputDot={inputDot}
          performOperation={performOperation}
        />
      </div>
    </div>
  );
};

const CalculatorWindow = windowWrapper(Calculator, "calculator");
export default CalculatorWindow;

import React, { useState, useEffect } from "react";
import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import useCalculator from "../../hooks/useCalculator";
import CalculatorDisplay from "./CalculatorDisplay";
import CalculatorKeypad from "./CalculatorKeypad";
import CalculatorAboutModal from "./CalculatorAboutModal";

const Calculator = () => {
  const { windows, setWindowData } = useWindowsStore();
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    if (windows.calculator?.data?.openAbout) {
      setShowAbout(true);
      setWindowData("calculator", { ...windows.calculator.data, openAbout: false });
    }
  }, [windows.calculator?.data?.openAbout, windows.calculator?.data, setWindowData]);

  const {
    displayValue,
    operator,
    expression,
    clearAll,
    clearDisplay,
    toggleSign,
    inputPercent,
    inputDigit,
    inputDot,
    performOperation,
  } = useCalculator();

  return (
    <>
      <div className="flex flex-col h-full w-full bg-[#1c1c1c]/90 backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl border border-white/10 select-none">
        <div id="window-header" className="shrink-0 pt-3 px-4 pb-2 flex items-center relative z-10">
          <WindowControls target="calculator" />
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 pt-2">
          <div className="flex w-full max-w-[340px] flex-col">
            <CalculatorDisplay expression={expression} displayValue={displayValue} />
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
      </div>
      <CalculatorAboutModal show={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
};

const CalculatorWindow = windowWrapper(Calculator, "calculator");
export default CalculatorWindow;

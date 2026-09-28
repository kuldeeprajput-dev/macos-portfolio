const btnStyle =
  "flex h-12 w-full items-center justify-center text-2xl font-normal rounded-full transition-colors active:scale-[0.96] active:opacity-70 focus:outline-none";

const CalculatorKeypad = ({
  displayValue,
  operator,
  clearAll,
  clearDisplay,
  toggleSign,
  inputPercent,
  inputDigit,
  inputDot,
  performOperation,
}) => {
  const clearText = displayValue !== "0" ? "C" : "AC";
  return (
    <div className="grid w-full grid-cols-4 gap-2">
      <button
        className={`${btnStyle} bg-[#a5a5a5] text-black hover:bg-[#d4d4d2]`}
        onClick={() => (displayValue !== "0" ? clearDisplay() : clearAll())}
      >
        {clearText}
      </button>
      <button
        className={`${btnStyle} bg-[#a5a5a5] text-black hover:bg-[#d4d4d2]`}
        onClick={toggleSign}
      >
        ±
      </button>
      <button
        className={`${btnStyle} bg-[#a5a5a5] text-black hover:bg-[#d4d4d2]`}
        onClick={inputPercent}
      >
        %
      </button>
      <button
        className={`${btnStyle} bg-[#ff9f0a] text-white hover:bg-[#ffb03a] ${operator === "/" ? "bg-[#ffb03a] ring-2 ring-white" : ""}`}
        onClick={() => performOperation("/")}
      >
        ÷
      </button>

      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050]`}
        onClick={() => inputDigit(7)}
      >
        7
      </button>
      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050]`}
        onClick={() => inputDigit(8)}
      >
        8
      </button>
      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050]`}
        onClick={() => inputDigit(9)}
      >
        9
      </button>
      <button
        className={`${btnStyle} bg-[#ff9f0a] text-white hover:bg-[#ffb03a] ${operator === "*" ? "bg-[#ffb03a] ring-2 ring-white" : ""}`}
        onClick={() => performOperation("*")}
      >
        ×
      </button>

      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050]`}
        onClick={() => inputDigit(4)}
      >
        4
      </button>
      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050]`}
        onClick={() => inputDigit(5)}
      >
        5
      </button>
      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050]`}
        onClick={() => inputDigit(6)}
      >
        6
      </button>
      <button
        className={`${btnStyle} bg-[#ff9f0a] text-white hover:bg-[#ffb03a] ${operator === "-" ? "bg-[#ffb03a] ring-2 ring-white" : ""}`}
        onClick={() => performOperation("-")}
      >
        −
      </button>

      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050]`}
        onClick={() => inputDigit(1)}
      >
        1
      </button>
      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050]`}
        onClick={() => inputDigit(2)}
      >
        2
      </button>
      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050]`}
        onClick={() => inputDigit(3)}
      >
        3
      </button>
      <button
        className={`${btnStyle} bg-[#ff9f0a] text-white hover:bg-[#ffb03a] ${operator === "+" ? "bg-[#ffb03a] ring-2 ring-white" : ""}`}
        onClick={() => performOperation("+")}
      >
        +
      </button>

      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050] col-span-2 !justify-start pl-8`}
        onClick={() => inputDigit(0)}
      >
        0
      </button>
      <button
        className={`${btnStyle} bg-[#333333] text-white hover:bg-[#505050]`}
        onClick={inputDot}
      >
        .
      </button>
      <button
        className={`${btnStyle} bg-[#ff9f0a] text-white hover:bg-[#ffb03a]`}
        onClick={() => performOperation("=")}
      >
        =
      </button>
    </div>
  );
};

export default CalculatorKeypad;

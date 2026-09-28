const CalculatorDisplay = ({ expression, displayValue }) => {
  const visibleValue = expression || displayValue;

  return (
    <div className="flex h-24 w-full items-end justify-end overflow-hidden mb-2 pr-2">
      <span className="shrink-0 whitespace-nowrap text-[4rem] text-white font-light tabular-nums leading-none tracking-tight">
        {visibleValue}
      </span>
    </div>
  );
};

export default CalculatorDisplay;

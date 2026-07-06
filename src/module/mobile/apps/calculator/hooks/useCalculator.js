import { useState } from "react";

const CalculatorOperations = {
  "/": (prevValue, nextValue) => prevValue / nextValue,
  "*": (prevValue, nextValue) => prevValue * nextValue,
  "+": (prevValue, nextValue) => prevValue + nextValue,
  "-": (prevValue, nextValue) => prevValue - nextValue,
  "=": (prevValue, nextValue) => nextValue,
};

export default function useCalculator() {
  const [value, setValue] = useState(null);
  const [displayValue, setDisplayValue] = useState("0");
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setValue(null);
    setDisplayValue("0");
    setOperator(null);
    setWaitingForOperand(false);
  };

  const clearDisplay = () => {
    setDisplayValue("0");
  };

  const toggleSign = () => {
    const currentValue = parseFloat(displayValue);
    if (isNaN(currentValue)) return;
    setDisplayValue(String(currentValue * -1));
  };

  const inputPercent = () => {
    const currentValue = parseFloat(displayValue);
    if (currentValue === 0 || isNaN(currentValue)) return;
    setDisplayValue(String(currentValue / 100));
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplayValue(String(digit));
      setWaitingForOperand(false);
      if (!operator) {
        setValue(null);
      }
    } else {
      setDisplayValue(
        displayValue === "0" || displayValue === "Error" ? String(digit) : displayValue + digit,
      );
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplayValue("0.");
      setWaitingForOperand(false);
      if (!operator) {
        setValue(null);
      }
    } else if (displayValue.indexOf(".") === -1 && displayValue !== "Error") {
      setDisplayValue(displayValue + ".");
      setWaitingForOperand(false);
    }
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(displayValue);

    if (isNaN(inputValue)) {
      clearAll();
      return;
    }

    if (value == null) {
      setValue(inputValue);
    } else if (operator) {
      if (waitingForOperand) {
        setOperator(nextOperator === "=" ? null : nextOperator);
        return;
      }
      const currentValue = value || 0;
      const newValue = CalculatorOperations[operator](currentValue, inputValue);

      if (isNaN(newValue) || !isFinite(newValue)) {
        setDisplayValue("Error");
        setValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }

      setValue(newValue);
      setDisplayValue(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator === "=" ? null : nextOperator);
  };

  return {
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
  };
}

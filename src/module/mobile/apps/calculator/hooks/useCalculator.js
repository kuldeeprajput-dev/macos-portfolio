import { useState } from "react";

const CalculatorOperations = {
  "/": (prevValue, nextValue) => prevValue / nextValue,
  "*": (prevValue, nextValue) => prevValue * nextValue,
  "+": (prevValue, nextValue) => prevValue + nextValue,
  "-": (prevValue, nextValue) => prevValue - nextValue,
  "=": (prevValue, nextValue) => nextValue,
};

const formatOperator = (operator) => operator.replace("*", "×").replace("/", "÷").replace("-", "−");

const replaceLastOperand = (expression, currentValue, nextValue) =>
  expression.endsWith(currentValue)
    ? `${expression.slice(0, -currentValue.length)}${nextValue}`
    : `${expression}${nextValue}`;

export default function useCalculator() {
  const [value, setValue] = useState(null);
  const [displayValue, setDisplayValue] = useState("0");
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState("");

  const clearAll = () => {
    setValue(null);
    setDisplayValue("0");
    setOperator(null);
    setWaitingForOperand(false);
    setExpression("");
  };

  const clearDisplay = () => {
    setDisplayValue("0");
    if (operator && !waitingForOperand) {
      setExpression(replaceLastOperand(expression, displayValue, ""));
    } else if (!operator) {
      setExpression("");
    }
  };

  const updateCurrentOperand = (nextDisplayValue) => {
    setDisplayValue(nextDisplayValue);
    if (operator && !waitingForOperand) {
      setExpression(replaceLastOperand(expression, displayValue, nextDisplayValue));
    } else if (!operator) {
      setExpression("");
    }
  };

  const toggleSign = () => {
    const currentValue = parseFloat(displayValue);
    if (isNaN(currentValue)) return;
    updateCurrentOperand(String(currentValue * -1));
  };

  const inputPercent = () => {
    const currentValue = parseFloat(displayValue);
    if (currentValue === 0 || isNaN(currentValue)) return;
    updateCurrentOperand(String(currentValue / 100));
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      const nextDisplayValue = String(digit);
      setDisplayValue(nextDisplayValue);
      setWaitingForOperand(false);
      if (!operator) {
        setValue(null);
        setExpression("");
      } else {
        setExpression(`${expression}${nextDisplayValue}`);
      }
      return;
    }

    const nextDisplayValue =
      displayValue === "0" || displayValue === "Error" ? String(digit) : displayValue + digit;
    setDisplayValue(nextDisplayValue);
    if (operator) {
      setExpression(replaceLastOperand(expression, displayValue, nextDisplayValue));
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplayValue("0.");
      setWaitingForOperand(false);
      if (!operator) {
        setValue(null);
        setExpression("");
      } else {
        setExpression(`${expression}0.`);
      }
      return;
    }

    if (!displayValue.includes(".") && displayValue !== "Error") {
      const nextDisplayValue = `${displayValue}.`;
      setDisplayValue(nextDisplayValue);
      if (operator) setExpression(`${expression}.`);
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
      setExpression(nextOperator === "=" ? "" : `${displayValue}${formatOperator(nextOperator)}`);
    } else if (operator && waitingForOperand) {
      if (nextOperator === "=") {
        setOperator(null);
        setExpression("");
      } else {
        setOperator(nextOperator);
        setExpression(
          `${expression.slice(0, -formatOperator(operator).length)}${formatOperator(nextOperator)}`,
        );
      }
      return;
    } else if (operator) {
      const newValue = CalculatorOperations[operator](value, inputValue);
      if (isNaN(newValue) || !isFinite(newValue)) {
        setDisplayValue("Error");
        setValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        setExpression("");
        return;
      }

      setValue(newValue);
      setDisplayValue(String(newValue));
      setExpression(nextOperator === "=" ? "" : `${expression}${formatOperator(nextOperator)}`);
    } else if (nextOperator !== "=") {
      setExpression(`${displayValue}${formatOperator(nextOperator)}`);
    } else {
      setExpression("");
    }

    setWaitingForOperand(true);
    setOperator(nextOperator === "=" ? null : nextOperator);
  };

  return {
    value,
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
  };
}

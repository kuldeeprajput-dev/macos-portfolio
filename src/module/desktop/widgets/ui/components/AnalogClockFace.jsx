import { useId } from "react";

const AnalogClockFace = ({ time, className = "" }) => {
  const faceGradientId = `clock-face-${useId().replaceAll(":", "")}`;
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;
  const hourAngle = hours * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;
  const dateLabel = time
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Analog clock showing ${time.toLocaleTimeString("en-US")}`}
      className={className}
    >
      <defs>
        <linearGradient id={faceGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5f7f6" />
          <stop offset="100%" stopColor="#d8e0e1" />
        </linearGradient>
      </defs>
      <circle
        cx="100"
        cy="100"
        r="98"
        fill={`url(#${faceGradientId})`}
        stroke="#bac5c7"
        strokeWidth="2"
      />
      {Array.from({ length: 60 }, (_, index) => {
        const major = index % 5 === 0;
        return (
          <line
            key={index}
            x1="100"
            y1={major ? "12" : "15"}
            x2="100"
            y2={major ? "22" : "18"}
            stroke={major ? "#657078" : "#a9b4b6"}
            strokeWidth={major ? "1.6" : "0.8"}
            transform={`rotate(${index * 6} 100 100)`}
          />
        );
      })}
      {Array.from({ length: 12 }, (_, index) => {
        const number = index === 0 ? 12 : index;
        const angle = (index * 30 - 90) * (Math.PI / 180);
        const x = 100 + Math.cos(angle) * 70;
        const y = 100 + Math.sin(angle) * 70;
        return (
          <text
            key={number}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#303b43"
            fontSize="10"
            fontFamily="system-ui, sans-serif"
          >
            {number}
          </text>
        );
      })}
      <text
        x="100"
        y="147"
        textAnchor="middle"
        fill="#788187"
        fontSize="6"
        fontFamily="system-ui, sans-serif"
      >
        {dateLabel}
      </text>
      <line
        x1="100"
        y1="108"
        x2="100"
        y2="58"
        stroke="#272d31"
        strokeWidth="4"
        strokeLinecap="round"
        transform={`rotate(${hourAngle} 100 100)`}
      />
      <line
        x1="100"
        y1="111"
        x2="100"
        y2="35"
        stroke="#272d31"
        strokeWidth="2.6"
        strokeLinecap="round"
        transform={`rotate(${minuteAngle} 100 100)`}
      />
      <line
        x1="100"
        y1="116"
        x2="100"
        y2="27"
        stroke="#f47b27"
        strokeWidth="1.1"
        strokeLinecap="round"
        transform={`rotate(${secondAngle} 100 100)`}
      />
      <circle cx="100" cy="100" r="4.5" fill="#727b80" />
      <circle cx="100" cy="100" r="1.7" fill="#f47b27" />
    </svg>
  );
};

export default AnalogClockFace;

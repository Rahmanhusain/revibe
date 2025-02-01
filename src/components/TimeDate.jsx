import React, { useState, useEffect, useRef } from "react";
import { TimeFormatContext } from "../context/TimeFormatProvider";

function TimeDate() {
 
  const [time, setTime] = useState(new Date());
  const requestRef = useRef(); // Ref to store the requestAnimationFrame ID

  const { is24 } = React.useContext(TimeFormatContext);

  // Update the time using requestAnimationFrame
  const updateTime = () => {
    setTime(new Date());
    requestRef.current = requestAnimationFrame(updateTime);
  };

  // Start the animation frame on mount
  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(requestRef.current); // Cleanup on unmount
  }, []);

  // Format the time (HH:MM AM/PM)
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !is24,
  });

  // Format the date (Day, DD Month)
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Split the formatted time into hours, minutes, and AM/PM
  const [hours, minutes, ampm] = formattedTime.split(/:| /);

  return (
    <div className="flex flex-col text-[var(--textColor)] items-center mt-4 xl:mt-7">
      <div className="flex gap-3">
        <h1 className="text-6xl xl:text-7xl font-semibold orbitron">{hours}</h1>
        <div className="flex flex-col gap-3 justify-center">
          {/* Blinking dots using CSS animation */}
          <span className="bg-[var(--textColor)] w-3 h-3 rounded-sm blink"></span>
          <span className="bg-[var(--textColor)] w-3 h-3 rounded-sm blink"></span>
        </div>
        <h1 className="text-6xl xl:text-7xl font-semibold orbitron">{minutes}</h1>
        <h1 className="text-6xl xl:text-7xl font-semibold orbitron">{ampm}</h1>
      </div>
      <p className="text-lg xl:text-2xl font-light">{formattedDate}</p>
    </div>
  );
}

// CSS for the blinking effect
const styles = `
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }
  .blink {
    animation: blink 2s infinite;
  }
`;

// Inject the styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default React.memo(TimeDate);
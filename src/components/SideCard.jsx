import React, { useState, useRef, useEffect } from "react";
import { ClockIcon } from "../icons/icon"; // Assuming you have an icon component

function SideCard() {
  const sideCardRef = useRef(null); // Ref for the SideCard container
  const moverRef = useRef(null); // Ref for the mover element
  const isDragging = useRef(false); // Track dragging state
  const initialY = useRef(0); // Initial Y position of the pointer
  const initialTop = useRef(0); // Initial top position of the SideCard
  const currentHourRef = useRef(new Date().getHours()); // Track the current hour
  const animationFrameRef = useRef(); // Ref to store the animation frame ID

  // Timer state and logic
  const [time, setTime] = useState(new Date());
  const timerRequestRef = useRef(); // Ref to store the timer's requestAnimationFrame ID

  // Update the time using requestAnimationFrame
  const updateTime = () => {
    setTime(new Date());
    timerRequestRef.current = requestAnimationFrame(updateTime);
  };

  // Start the timer animation frame on mount
  useEffect(() => {
    timerRequestRef.current = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(timerRequestRef.current); // Cleanup on unmount
  }, []);

  // Format the time (HH:MM AM/PM)
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Format the date (Day, DD Month)
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Split the formatted time into hours, minutes, and AM/PM
  const [hours, minutes, ampm] = formattedTime.split(/:| /);

  const isAnimating = useRef(false);

  const toggleSideCard = () => {
    if (isAnimating.current) return; // Prevent toggling during animation

    if (sideCardRef.current) {
      sideCardRef.current.classList.toggle("sidehide");
      isAnimating.current = true; // Lock during animation

      // After toggling, wait for 3 seconds before toggling back
      const holdTimeout = setTimeout(() => {
        if (sideCardRef.current) {
          sideCardRef.current.classList.toggle("sidehide");
        }
        isAnimating.current = false; // Unlock after animation
      }, 5000); // 3 seconds hold

      // Cleanup the hold timeout
      return () => clearTimeout(holdTimeout);
    }
  };

  const isTesting = false; // Set to false for production (hourly checks)

  // Check for time changes
  const checkHourChange = () => {
    const now = new Date();

    if (isTesting) {
      // Trigger every 10 seconds for testing
      const currentSeconds = now.getSeconds();
      if (currentSeconds % 10 === 0) {
        toggleSideCard();
      }
    } else {
      // Trigger only on hour change for production
      const currentHour = now.getHours();
      if (currentHour !== currentHourRef.current) {
        currentHourRef.current = currentHour;
        toggleSideCard();
      }
    }

    // Continue the loop
    animationFrameRef.current = requestAnimationFrame(checkHourChange);
  };

  // Start the hour-checking loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(checkHourChange);

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle pointer down event
  const handlePointerDown = (e) => {
    isDragging.current = true;
    initialY.current = e.clientY;
    initialTop.current = sideCardRef.current.getBoundingClientRect().top;
    moverRef.current.setPointerCapture(e.pointerId); // Capture pointer events
  };

  // Handle pointer move event
  const handlePointerMove = (e) => {
    if (!isDragging.current) return;

    // Calculate new top position
    const deltaY = e.clientY - initialY.current;
    let newTop = initialTop.current + deltaY;

    // Constrain movement within viewport
    const viewportHeight = window.innerHeight;
    const sideCardHeight = sideCardRef.current.offsetHeight;

    // Ensure the card doesn't go above the top of the viewport
    newTop = Math.max(0, newTop);

    // Ensure the card doesn't go below the bottom of the viewport
    newTop = Math.min(newTop, viewportHeight - sideCardHeight);

    // Update SideCard position
    sideCardRef.current.style.top = `${newTop}px`;
  };

  // Handle pointer up event
  const handlePointerUp = () => {
    isDragging.current = false;
  };



  //screen time Logic // Initialize when the component mounts
  const [totalDuration, setTotalDuration] = useState(0);
  const screenref = useRef();
  
  useEffect(() => {
    // Fetch the stored total duration
    let storedDuration = 0;
    chrome.storage.local.get(["totalDuration"], (result) => {
      storedDuration = result.totalDuration || 0;
      console.log("first time: ", result.totalDuration);
    });
  
    // Variable to track the start time of the current session
    const startTime = Date.now();
  
    const updateDuration = () => {
      // Calculate elapsed time since the start of this session
      const elapsedTime = Date.now() - startTime;
      setTotalDuration(storedDuration + elapsedTime);
      screenref.current = requestAnimationFrame(updateDuration); // Loop
    };
  
    screenref.current = requestAnimationFrame(updateDuration);
  
    return () => {
      if (screenref.current) {
        cancelAnimationFrame(screenref.current); // Stop the loop
      }
    };
  }, []);
  
  
  
  
  
  

  const formatDuration = (ms) => {
    const totalMinutes = Math.floor(ms / 60000); // Convert ms to minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hrs ${minutes} min`;
  };
  return (
    <div
      ref={sideCardRef}
      className="flex bg-[#e1cbcb27] text-white rounded-e-lg shadow-xl backdrop-blur-lg fixed left-0 sidecardanimation sidehide"
      style={{ top: "15%" }} // Initial position
    >
      <div className="flex-grow p-2 flex items-center gap-4">
        {/* Timer Component */}
        <div className="flex flex-col text-[var(--textColor)]">
          <div className="flex gap-1">
            <h1 className="text-sm font-semibold orbitron">{hours}</h1>
            <div className="flex flex-col gap-0.5 justify-center">
              {/* Blinking dots using CSS animation */}
              <span className="bg-[var(--textColor)] w-1 h-1 rounded-sm blink"></span>
              <span className="bg-[var(--textColor)] w-1 h-1 rounded-sm blink"></span>
            </div>
            <h1 className="text-sm font-semibold orbitron">{minutes}</h1>
            <h1 className="text-sm font-semibold orbitron">{ampm}</h1>
          </div>
          <p className="text-sm font-light">{formattedDate}</p>
        </div>
        {/* Timer Component end */}
        <div className="flex bg-[#5e5c5caf] rounded-md px-2 py-1.5 items-center gap-2">
          <div className="flex-grow flex-col">
            <p className="text-[0.65rem] font-thin">Screen Time</p>
            <p className="text-sm">{formatDuration(totalDuration)}</p>
          </div>
          <ClockIcon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Mover element */}
      <div
        ref={moverRef}
        className="mover w-4 hover:bg-[#5655554a] rounded-e-lg flex-grow flex flex-col gap-1 items-center justify-center cursor-move"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => {
          sideCardRef.current.classList.toggle("sidehide");
        }}
      >
        <div className="h-1 w-1 bg-[#98d7ee] rounded-md"></div>
        <div className="h-1 w-1 bg-[#98d7ee] rounded-md"></div>
        <div className="h-1 w-1 bg-[#98d7ee] rounded-md"></div>
      </div>
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

export default React.memo(SideCard);

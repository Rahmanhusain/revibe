import React, { createContext, useEffect, useState } from 'react';

// Create a context
export const TimeFormatContext = createContext();

// Create a provider component
export const TimeFormatProvider = ({ children }) => {
  const [is24, setis24] = useState(false); // Initial state
  useEffect(() => {
    // Load shortcuts from local storage on component mount
    chrome.storage.local.get(["theme"], (result) => {
      if (result.theme) {
       setis24(result.theme.is24);
      }
    });
  }, []);
  return (
    <TimeFormatContext.Provider value={{ is24, setis24 }}>
      {children}
    </TimeFormatContext.Provider>
  );
};
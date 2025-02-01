import React from "react";
import { createRoot } from "react-dom/client";
import ChatBot from "./components/ChatBot";

chrome.storage.local.get(["isContentInjectionEnabled"], (result) => {
  if (chrome.runtime.lastError) {
    console.error("Error retrieving storage:", chrome.runtime.lastError);
    return;
  }

/*   console.log("Storage result:", result);  */

  let Inject;

  if (result.isContentInjectionEnabled !== undefined) {
 /*    console.log("isContentInjectionEnabled found in storage:", result.isContentInjectionEnabled); */
    Inject = result.isContentInjectionEnabled === true;
  } else {
  /*   console.log("isContentInjectionEnabled not found in storage, defaulting to true"); */
    Inject = true; // Default value
  }

  if (Inject) {
    /* console.log("Injecting content..."); */

    // Inject Google Fonts
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Cookie&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    // Create a div to mount the React component
    const app = document.createElement("div");
    app.id = "Rahman_chatBox";
    document.body.appendChild(app);

    // Mount the React component
    createRoot(app).render(<ChatBot />);
  } else {
    console.log("Content injection is disabled.");
  }
});
import React from "react";
import { createRoot } from "react-dom/client";
import SideCard2 from "./components/SideCard2";

chrome.storage.local.get(["isContentInjectionEnabled"], (result) => {
  if (chrome.runtime.lastError) {
    console.error("Error retrieving storage:", chrome.runtime.lastError);
    return;
  }

  console.log("Storage result:", result); // Log the entire result object

  let Inject;

  if (result.isContentInjectionEnabled !== undefined) {
/*     console.log("isContentInjectionEnabled found in storage:", result.isContentInjectionEnabled);
 */    Inject = result.isContentInjectionEnabled === true;
  } else {
/*     console.log("isContentInjectionEnabled not found in storage, defaulting to true");
 */    Inject = true; // Default value
  }

  if (Inject) {
/*     console.log("Injecting content...");
 */
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    // Create a div to mount the React component
    const app = document.createElement("div");
    app.id = "Rahman_my-extension-root";
    document.body.appendChild(app);

    // Mount the React component
    createRoot(app).render(<SideCard2 />);
  } else {
    console.log("Content injection is disabled.");
  }
});
import React, { useState, useEffect } from "react";
import { EyeCloseIcon, EyeOpenIcon, ResetIcon } from "./icons/icon";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isContentInjectionEnabled, setIsContentInjectionEnabled] =
    useState(true);

    const [ischecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Fetch saved settings from chrome.storage.local
    chrome.storage.local.get(
      ["geminiApiKey", "isContentInjectionEnabled"],
      (result) => {
        if (chrome.runtime.lastError) {
          console.error("Error retrieving storage:", chrome.runtime.lastError);
        } else {
          if (result.geminiApiKey) {
            setApiKey(result.geminiApiKey);
          }
          if (result.isContentInjectionEnabled !== undefined) {
            setIsContentInjectionEnabled(result.isContentInjectionEnabled);
          } else {
            // Set default value if not found in storage
            setIsContentInjectionEnabled(true);
          }
        }
      }
    );
  }, []);

  const handleSaveApiKey = () => {
    chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving API key:", chrome.runtime.lastError);
      } else {
        alert("API key saved successfully.");
        console.log("API Key saved!");
      }
    });
  };

  const handleToggleContentInjection = () => {
    const newValue = !isContentInjectionEnabled;
    chrome.storage.local.set({ isContentInjectionEnabled: newValue }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving to storage:", chrome.runtime.lastError);
      } else {
        console.log("Value saved successfully:", newValue);
        setIsContentInjectionEnabled(newValue); // Update state after saving
      }
    });
  };
  

  async function checkForUpdate() {
    try {
      const response = await fetch("https://rahmanhusain.github.io/My-Portfolio/revibeversion.json");
      const data = await response.json();
      const latestVersion = data.version;
      console.log(latestVersion)
      const currentVersion = chrome.runtime.getManifest().version;
  
      if (latestVersion !== currentVersion) {
      if (confirm(`Update Available - version-${latestVersion} available! Click OK to download.`)) {
        window.open("https://revibeweb.vercel.app/", "_blank");
      }
      }else{
        confirm("No updates available")
     }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  }

  const checkUpdate = async() => {
    setIsChecking(true)
 await checkForUpdate()
  setIsChecking(false)
  }
  return (
    <div className="relative p-4 w-[380px] min-h-[400px] bg-gray-900 text-gray-100 overflow-hidden border border-gray-800">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 to-purple-700/20 blur-xl opacity-50"></div>

      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-6xl font-extrabold opacity-20  pointer-events-none">
        <img src="/icons/logo.png" alt="" className="w-[60%] h-auto" />
      </div>

      {/* Header */}
      <header className="relative z-10 text-center">
        <h1 className="text-2xl font-bold text-white orbitron">ReVibe</h1>
        <p className="mt-1 text-sm text-gray-400">
          A sleek, vibrant browsing experience with real-time AI chats, anytime,
          anywhere.
        </p>
      </header>

      {/* API Key Input */}
      <div className="relative z-10 mt-6">
        <label className="block text-sm font-medium text-gray-300">
          Gemini API Key
        </label>
        <div className="mt-2 flex items-center rounded-lg shadow-inner">
          <div className="w-full relative flex items-center justify-center">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-transparent text-gray-200 focus:outline-none pr-8 border border-gray-500 text-base p-2 bg-gray-800 rounded-lg"
              placeholder="Enter API key"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 "
            >
              {showApiKey ? (
                <EyeCloseIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeOpenIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          <button
            onClick={handleSaveApiKey}
            className="ml-2 px-3 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md"
          >
            Save
          </button>
        </div>
      </div>

      {/* Toggle for Content Injection */}
      <div className="relative z-10 mt-6">
        <label className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-300">
            Enable Content Injection
          </span>
          <input
            type="checkbox"
            checked={isContentInjectionEnabled}
            onChange={handleToggleContentInjection}
            className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <span className="text-sm text-gray-400">{"( Refresh Required )"}</span>
       
      </div>
      <button disabled={ischecking} className="flex gap-2 text-sm items-center bg-gray-600 py-2 px-3 rounded-lg absolute bottom-16" onClick={checkUpdate}>
          {!ischecking&&<ResetIcon className="w-5 h-5 text-white" />}{ischecking?"Checking..." :"Check For Updates"}
        </button>
      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800/90 border-t border-gray-700 flex items-center justify-between">
        <a
          href="https://revibeweb.vercel.app/report"
          target="_blank"
          rel="noopener noreferrer"
          className=""
          title="Report an issue"
        >
          ❓
        </a>
        <div className="flex space-x-4">
          <a
            href="https://github.com/Rahmanhusain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200"
          >
            GitHub
          </a>
          <a
            href="https://rahmanfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200"
          >
            Portfolio
          </a>
          <a
            href="https://www.linkedin.com/in/rahman-husain-45bb60237/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;

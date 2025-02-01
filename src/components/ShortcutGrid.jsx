import React, { useState, useEffect, useRef } from "react";
import { PlusCircleIcon } from "../icons/icon";
import AddEditDialog from "./AddEditDialog";

const ShortcutGrid = () => {
  const [shortcuts, setShortcuts] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const moderef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imgError, setImgError] = useState({}); // Track errors per index

  useEffect(() => {
    // Load shortcuts from local storage on component mount
    chrome.storage.local.get(["shortcuts"], (result) => {
      if (result.shortcuts) {
        setShortcuts(result.shortcuts);
      }
    });
  }, []);

  const saveShortcuts = (newShortcuts) => {
    setShortcuts(newShortcuts);
    chrome.storage.local.set({ shortcuts: newShortcuts });
  };

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    setContextMenu({
      x: clientX,
      y: clientY,
      index,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleDelete = (index) => {
    const newShortcuts = shortcuts.filter((_, i) => i !== index);
    saveShortcuts(newShortcuts);
    closeContextMenu();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      closeContextMenu();
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getFavicon = (pageUrl) => {
    try {
      const url = new URL(pageUrl);
      return `https://www.google.com/s2/favicons?domain=${url.origin}&sz=64`;
    } catch (error) {
      console.error("Invalid URL:", pageUrl);
      return "default-favicon-url"; // Provide a default favicon URL or handle the error as needed
    }
  };

  const handleImageError = (index) => {
    setImgError((prev) => ({ ...prev, [index]: true })); // Set error for the specific index
  };

  return (
    <div className="bottom-5 right-5 absolute">
      <div className="bg-[#e1cbcb27] py-5 px-4 rounded-lg max-w-sm mx-auto h-[11.50rem] overflow-auto custom-scrollbar">
        <h2 className="text-white absolute text-[0.88rem] font-semibold -top-7 select-none">
          Shortcuts
        </h2>
        <div className="grid grid-cols-4 gap-x-3 gap-y-4">
          {shortcuts &&
            shortcuts.map((shortcut, i) => (
              <a
                key={i}
                href={shortcut.url}
                className="w-16 h-16 flex flex-col justify-center items-center gap-1 cursor-pointer"
                onContextMenu={(e) => handleContextMenu(e, i)}
              >
                {!imgError[i] ? ( // Only show the image if there's no error for this index
                  <img
                    src={getFavicon(shortcut.url)}
                    alt={shortcut.name.charAt(0).toUpperCase()}
                    className="w-8 h-8 object-cover rounded-md"
                    onError={() => handleImageError(i)} // Handle error for this index
                  />
                ) : (
                  // Fallback: Show a div with the first letter of the name
                  <div className="w-9 h-9 bg-[#b9c8dc7b] rounded-full flex items-center justify-center">
                    <p className="text-white font-serif text-lg">{shortcut.name.charAt(0).toUpperCase()}</p>
                  </div>
                )}
                <span className="text-xs text-gray-200 font-light w-14 text-center overflow-hidden whitespace-nowrap text-ellipsis">
                  {shortcut.name}
                </span>
              </a>
            ))}
          <button
            className="w-16 h-16 flex flex-col justify-center items-center rounded-full cursor-pointer"
            onClick={() => {
              moderef.current = "Add";
              setIsOpen(!isOpen);
            }}
          >
            <PlusCircleIcon className="w-8 h-8 text-gray-200" />
          </button>
        </div>
        {contextMenu && (
          <div
            className="fixed bg-gray-200 shadow-lg rounded-md z-10"
            style={{
              top: `${contextMenu.y - 80}px`,
              left: `${contextMenu.x - 90}px`,
            }}
          >
            <button
              className="block w-full text-left px-6 h-8 hover:bg-gray-300 rounded-md"
              onClick={() => {
                moderef.current = "Edit";
                setSelectedIndex(contextMenu.index);
                setIsOpen(!isOpen);
              }}
            >
              Edit
            </button>
            <button
              className="block w-full text-left px-6 h-8 hover:bg-gray-300 rounded-md"
              onClick={() => handleDelete(contextMenu.index)}
            >
              Remove
            </button>
          </div>
        )}
      </div>
      {isOpen && (
        <AddEditDialog
          Mode={moderef.current}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          shortcuts={shortcuts}
          setShortcuts={saveShortcuts}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
};

export default React.memo(ShortcutGrid);
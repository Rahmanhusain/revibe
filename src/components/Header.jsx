import React, { useState, lazy, Suspense } from "react";
import { GoogleIcon, MailIcon, SettingsIcon2 } from "../icons/icon";
const SettingsPanel = lazy(() => import("./SettingsPanel"));

function Header({ themeindex, setthemeindex,editableContent }) {
  const [isopen, setisopen] = useState(false);
 
  return (
    <nav className="flex h-12 w-full  justify-between items-center">
      <div
        contentEditable
        id="editableContent"
        ref={(div) => {
          if (div) div.innerText = editableContent.toString();
        }}
        onInput={(e) => {
          chrome.storage.local.set({ editableContent: e.target.innerText });
        }}
        className="kode-mono-glitter h-full w-fit  outline-none flex items-center ml-3 text-lg text-[var(--textColor)] select-none"
      />
      <div className=" w-fit h-full flex gap-4 items-center mr-3">
        <a href="https://www.google.com">
          <GoogleIcon className="w-6 h-6 cursor-pointer" />
        </a>
        <a href="https://www.gmail.com">
          <MailIcon className="w-7 h-7 text-white cursor-pointer" />
        </a>
        <button
          className="h-fit w-fit outline-none"
          onClick={() => setisopen(true)}
        >
          <SettingsIcon2 className="w-7 h-7 text-white hover:rotate-90 transition-transform duration-500 ease-in-out" />
        </button>
      </div>
      {isopen && (
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-4 bg-[#3c3c3cef] rounded-s-lg shadow-md fixed top-0 bottom-0 right-0 w-[30rem] z-10 text-white ">
              <div className="flex space-x-2 items-center">
                <div className="h-2 w-2 bg-[var(--textColor)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-[var(--textColor)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-[var(--textColor)] rounded-full animate-bounce"></div>
              </div>
            </div>
          }
        >
          <SettingsPanel
            setisopen={setisopen}
            themeindex={themeindex}
            setthemeindex={setthemeindex}
          />
        </Suspense>
      )}
    </nav>
  );
}

export default React.memo(Header);

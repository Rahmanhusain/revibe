import React, { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import { TimeFormatProvider } from "./context/TimeFormatProvider";
import Header from "./components/Header";
import ChatBot from "./components/ChatBot";

const ShortcutGrid = lazy(() => import("./components/ShortcutGrid"));
const TimeDate = lazy(() => import("./components/TimeDate"));
const QouteComp = lazy(() => import("./components/QouteComp"));
const SideCard = lazy(() => import("./components/SideCard"));

function NewTab() {
  const [themeindex, setthemeindex] = useState(0);
  const [editableContent, setEditableContent] = useState("./root");

  useEffect(() => {
    // Load shortcuts from local storage on component mount
    chrome.storage.local.get(["theme", "selectedTheme","editableContent"], (result) => {
      if (result.theme) {
        document.documentElement.style.setProperty(
          "--bgColor",
          result.theme.bgColor
        );
        document.documentElement.style.setProperty(
          "--textColor",
          result.theme.textColor
        );
      }
      if (result.selectedTheme!==undefined) {
        document.getElementById(
          "background"
        ).style.background = `center / cover no-repeat url(${result.selectedTheme.img})`;
        setthemeindex(result.selectedTheme.themeindex);
      }else{
        document.getElementById(
          "background"
        ).style.background = `center / cover no-repeat url("images/planet.webp")`;
      }
      if (result.editableContent) {
        setEditableContent(result.editableContent); // Update state
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div id="background" className="bg -z-[1]"></div>
      <TimeFormatProvider>
        <Header themeindex={themeindex} setthemeindex={setthemeindex} editableContent={editableContent} />
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-4 bg-[#3c3c3cef] fixed top-0 bottom-0 right-0 left-0 z-10 text-white ">
              <div className="flex space-x-2 items-center">
                <div className="h-2 w-2 bg-[var(--textColor)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-[var(--textColor)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-[var(--textColor)] rounded-full animate-bounce"></div>
              </div>
            </div>
          }
        >
          <TimeDate />

          <ShortcutGrid />
          <QouteComp />
          <SideCard />
        </Suspense>
      </TimeFormatProvider>
      {/* <ChatBot /> */}
    </div>
  );
}

export default NewTab;

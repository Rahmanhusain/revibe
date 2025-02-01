import React, { useState, useEffect } from "react";
import {
  BuyMeACoffee,
  CheckCircleIcon,
  CloudUploadIcon,
  GitHubIcon,
  Instagram,
  LinkedInIcon,
  ResetIcon,
  Tag_Cross_Icon,
  Xlogo,
} from "../icons/icon";
import { TimeFormatContext } from "../context/TimeFormatProvider";

const SettingsPanel = React.memo(({ setisopen, themeindex, setthemeindex }) => {
  const [bgOpacity, setBgOpacity] = useState(38);
  const [closeAnim, setCloseAnim] = useState(false);
  const { is24, setis24 } = React.useContext(TimeFormatContext);
  const [showQR, setShowQR] = useState(false);

  /*  console.log(themeindex) */

  const themes = [
    {
      name: "Deadpool",
      img: "/images/dead.webp",
    },
    {
      name: "Minimal",
      img: "/images/planet.webp",
    },
    {
      name: "Sukuna",
      img: "/images/sukuna.webp",
    },
    {
      name: "Girl Aesthetic",
      img: "/images/Girl.webp",
    },
  ];

  useEffect(() => {
    // Load existing theme from local storage
    chrome.storage.local.get(["theme"], (result) => {
      if (result.theme) {
        const { textColor, bgColor } = result.theme;
        document.getElementById("color").value = textColor;
        setis24(result.theme.is24);
        setBgOpacity(bgColor.split(",")[3].replace(")", "") * 100);
      }
    });
  }, []);

  return (
    <div
      className={`settings-panel flex flex-col p-4 bg-[#3c3c3cef] rounded-s-lg shadow-md fixed top-0 bottom-0 right-0 w-[30rem] z-10 text-white ${
        closeAnim ? "transition-transform2-reverse" : "transition-transform2"
      }`}
    >
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <button
          className="h-fit w-fit outline-none"
          onClick={() => {
            setCloseAnim(true);
            setTimeout(() => {
              setisopen(false);
            }, 475);
          }}
        >
          <Tag_Cross_Icon className="text-white h-6 w-6" />
        </button>
      </div>
      <div className="flex justify-between mb-4">
        <div className="color-picker">
          <label htmlFor="color" className="block text-sm font-medium">
            Text Color
          </label>
          <input
            type="color"
            id="color"
            onChange={(e) => {
              /*  setColor(e.target.value); */
              document.documentElement.style.setProperty(
                "--textColor",
                e.target.value
              );
              document.getElementById("color").value = e.target.value;

              chrome.storage.local.get(["theme"], (result) => {
                const existingTheme = result.theme || {}; // Get existing theme or default to empty object
                const updatedTheme = {
                  ...existingTheme,
                  textColor: e.target.value,
                }; // Merge existing theme with new textColor

                // Save the updated theme
                chrome.storage.local.set({ theme: updatedTheme }, () => {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                  }
                });
              });
            }}
            className="w-full h-8 px-0.5 rounded-md bg-gray-600"
          />
        </div>

        <div className="time-format ">
          <label className="block text-sm font-medium  mb-1">Time Format</label>
          <button
            onClick={() => {
              const newIs24 = !is24;
              setis24(newIs24); // Update the state

              chrome.storage.local.get(["theme"], (result) => {
                const existingTheme = result.theme || {}; // Get existing theme or default to empty object
                const updatedTheme = {
                  ...existingTheme,
                  is24: newIs24, // Update the is24 field
                };

                // Save the updated theme
                chrome.storage.local.set({ theme: updatedTheme }, () => {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                  }
                });
              });
            }}
            className="w-full rounded-md h-8 border"
          >
            {is24 ? "24hrs" : "12hrs"}
          </button>
        </div>
      </div>

      <div className="bg-opacity mb-4">
        <label className="text-sm font-medium  mb-1 flex gap-2">
          BG Opacity{" "}
          <span className="text-xs font-extralight  flex items-center bg-[#2b2727e2] px-2 rounded-md">
            {bgOpacity}%
          </span>
        </label>
        <input
          id="small-range"
          type="range"
          value={bgOpacity}
          min="0"
          max="100"
          step="0.1"
          onChange={(e) => {
            const value = e.target.value;
            setBgOpacity(value);
            document.documentElement.style.setProperty(
              "--bgColor",
              `rgba(0, 0, 0, ${value / 100})`
            );

            chrome.storage.local.get(["theme"], (result) => {
              const existingTheme = result.theme || {}; // Get existing theme or default to empty object
              const updatedTheme = {
                ...existingTheme,
                bgColor: `rgba(0, 0, 0, ${value / 100})`,
              }; // Merge existing theme with new bgColor

              // Save the updated theme
              chrome.storage.local.set({ theme: updatedTheme }, () => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                }
              });
            });
          }}
          className="w-full h-1 rounded-l  bg-slate-400 appearance-none cursor-pointer range-custom"
        />
      </div>

      <div className="themes flex flex-col h-full overflow-hidden pb-4">
        <div className="flex justify-between">
          <h3 className="text-lg mb-2">Themes</h3>
          <button
            className="h-fit w-fit outline-none"
            onClick={() => {
              document.documentElement.style.setProperty(
                "--bgColor",
                `rgba(0, 0, 0,0.38)`
              );
              document.documentElement.style.setProperty(
                "--textColor",
                "#f5f5f5"
              );
              document.getElementById("color").value = "#f5f5f5";
              setBgOpacity(38);
              chrome.storage.local.set({
                theme: { textColor: "#f5f5f5", bgColor: "rgba(0, 0, 0, 0.38)" },
              });
            }}
          >
            <ResetIcon className="text-white h-6 w-6" />
          </button>
        </div>
        <div className="max-h-full grid grid-cols-2 gap-x-4 gap-y-4 pr-1 pl-2 py-2 overflow-auto custom-scrollbar">
          {themes.map((theme, i) => (
            <div
              className="flex flex-col gap-1 h-36 relative cursor-pointer"
              key={i}
              onClick={() => {
                chrome.storage.local.set({
                  selectedTheme: { themeindex: i, img: theme.img },
                });
                document.getElementById(
                  "background"
                ).style.background = `center / cover no-repeat url(${theme.img})`;
                setthemeindex(i);
              }}
            >
              <div className="imgtheme relative overflow-hidden rounded-xl">
                <img
                  src={theme.img}
                  alt=""
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <p className="pl-1">{theme.name}</p>
              {i === themeindex && (
                <CheckCircleIcon className="absolute top-2 left-2 h-5 w-5 text-gray-200" />
              )}
            </div>
          ))}

          <div
            className="flex flex-col gap-1 h-36 relative"
            onClick={() => {
              const fileInput = document.getElementById("fileInput");
              fileInput.click(); // Trigger the file input dialog

              // Use a change event listener to handle the file selection
              fileInput.addEventListener(
                "change",
                () => {
                  const file = fileInput.files[0]; // Get the selected file

                  if (file) {
                    // Check if a file is selected
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const img = new Image();
                      img.src = reader.result;
                      img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        const dataUrl = canvas.toDataURL("image/webp", 0.9); // Convert to WebP format
                        document.getElementById(
                          "background"
                        ).style.background = `center / cover no-repeat url(${dataUrl})`;

                        // Save the image data URL to Chrome storage
                        chrome.storage.local.set({
                          selectedTheme: { themeindex: -1, img: dataUrl },
                        });

                        setthemeindex(-1); // Update the theme index
                      };
                    };
                    reader.readAsDataURL(file); // Read the file as a data URL
                  } else {
                    console.error("No file selected.");
                  }
                },
                { once: true }
              ); // Ensure the event listener is removed after execution
            }}
          >
            <div className="imgtheme flex items-center justify-center relative overflow-hidden h-full rounded-xl cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <CloudUploadIcon className="w-8 h-8 text-white mx-auto" />
                <span className="font-serif">Choose file</span>
              </label>{" "}
            </div>
            <p className="pl-1">Custom Image</p>

            {themeindex === -1 && (
              <CheckCircleIcon className="absolute top-2 left-2 h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      <div className="footer-setting flex justify-between ">
        <div className="">
          <button
            className="flex items-center gap-1 h-full px-2 my-auto rounded-md gradback"
            onMouseEnter={() => {
              setShowQR(true);
            }}
            onMouseLeave={() => {
              setShowQR(false);
            }}
          >
            <BuyMeACoffee className="w-4 h-4 text-white" /> Buy me a coffee
          </button>
          {showQR && (
            <div className="w-[20rem] bg-[#1b1a1e] QRanim rounded-xl flex flex-col items-center p-4 gap-3 fixed top-1/2 left-1/2 z-50">
              <h2 className="text-2xl font-bold text-white mb-2 cookie gradient-text">
                Support Future Updates
              </h2>
              <img
                src="/images/QR.jpg"
                alt=""
                className="max-w-full aspect-square"
              />
              <p>Receiver Name - Imran</p>
              <div className="text-center">
                <p className="text-gray-400 leading-3 ">
                  Scan the QR code to support me and help keep this project
                  alive. Your contribution means a lot!
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="realtive flex gap-2">
          <a
            href="https://github.com/Rahmanhusain"
            target="_blank"
            className="flex items-center p-2 rounded-full bg-[#1f1e1e]"
          >
            <GitHubIcon className="w-4 h-4 text-white" />
          </a>
          <a
            href="https://www.linkedin.com/in/rahman-husain-45bb60237/"
            target="_blank"
            className="flex items-center p-2 rounded-full bg-[#1f1e1e]"
          >
            <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
          </a>
          <a
            href="https://x.com/_rahmanhusain?t=gNyQXtVLwaSkzcSFVZp9bw&s=08"
            target="_blank"
            className="flex items-center p-2 rounded-full bg-[#1f1e1e]"
          >
            <Xlogo className="w-4 h-4 text-white" />
          </a>
          <a
            href="https://www.instagram.com/_rahmanhusain?utm_source=qr&igsh=MXVmNGN1cm42OHRpeQ=="
            target="_blank"
            className="flex items-center p-2 rounded-full bg-[#1f1e1e]"
          >
            <Instagram color="#E1306C" className="w-4 h-4" />
          </a>
          {/* <button className="flex items-center p-2 rounded-full gradback">
            <LinkChainIcon className="w-4 h-4 text-white" />
          </button> */}
        </div>
      </div>
    </div>
  );
});

export default SettingsPanel;

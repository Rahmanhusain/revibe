import React, { useState, useRef, useEffect } from "react";
import { ChatBotIcon, SendIcon, CrossIcon, CropImage } from "../icons/icon";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Croppercomp from "./Croppercomp";
import "../contentcss.css";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatAreaRef = useRef(null);
  const chatboxref = useRef(null);
  const inputRef = useRef(null);
  const dragRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [inputcontent, setInputContent] = useState("");

  const [position, setPosition] = useState({
    x: window.innerWidth - 420,
    y: window.innerHeight - 520,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Screenshot states
  const [viewportScreenshot, setViewportScreenshot] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [hidechatbox, sethidechatbox] = useState(false);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender === "user"
    ) {
      chatboxref.current.scrollTop = chatboxref.current.scrollHeight;
    }
  }, [messages]);

  const [Api_key, Set_Api_key] = useState("");
  const genAI = new GoogleGenerativeAI(Api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  useEffect(() => {
    chrome.storage.local.get(["geminiApiKey"], (result) => {
      if (result.geminiApiKey) {
        Set_Api_key(result.geminiApiKey);
      }
    });
  }, []);

  const handleSendMessage = async () => {
    setIsSending(true);
    const text = inputRef.current.innerText.trim();

    if (text !== "") {
      // Add the user's message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text, sender: "user" },
      ]);

      try {
        const parts = [{ text: text }]; // Always include the text prompt

        // Conditionally include the image if it exists
        if (croppedImage) {
          // Ensure the dataURL is properly formatted
          const base64Data = croppedImage.split(",")[1]; // Extract base64 string (removes the prefix)

          parts.push({
            inline_data: {
              mime_type: "image/png", // MIME type for PNG images
              data: base64Data, // Pass only base64 data
            },
          });
        }

        // Generate content using the Gemini API
        const botResponse = await model.generateContent(parts);
        const botReplyText = botResponse.response.text(); // Extracts text content

        // Add the bot's response to the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botReplyText, sender: "bot" },
        ]);
        setCroppedImage(null); // Clear the cropped image
      } catch (error) {
        let errorMessage = "Something went wrong. Please try again.";
        if (error.message.includes("API key not valid")) {
          errorMessage = "API key is invalid. Please check your API key.";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Network error: Please check your internet connection.";
        } else if (error.message.includes("Failed to load resource")) {
          errorMessage = "Server error: The server is overloaded or down.";
        }
        console.error("Error fetching response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: errorMessage, sender: "bot" },
        ]);
      } finally {
        setIsSending(false);
        inputRef.current.innerText = ""; // Clear input
      }
    }
  };

  const handleKeyDown = (event) => {
    setTimeout(() => {
      setInputContent(inputRef.current.innerText.trim());
    }, 0);
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;

    // Prevent moving out of viewport
    newX = Math.max(0, Math.min(window.innerWidth - 400, newX));
    newY = Math.max(0, Math.min(window.innerHeight - 500, newY));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Capture the visible area (viewport) screenshot
  const captureViewport = async () => {
    sethidechatbox(true); // Hide the chatbox
    
  };

  useEffect(() => {
    if (hidechatbox) {
      setTimeout(() => {
        chrome.runtime.sendMessage(
          { action: "captureScreenshot" },
          (response) => {
            if (response.error) {
              console.error("Error:", response.error);
              return;
            }

            if (response.dataUrl) {
              setViewportScreenshot(response.dataUrl);
              setIsDialogOpen(true);
            }
          }
        );
      }, 100);
    }
  }, [hidechatbox]);

  return (
    <>
      {!isDialogOpen && hidechatbox && (
        <div id="chat-container" className="chat-container"></div>
      )}
      <div
        className={`chatbox-context ${
          hidechatbox ? "hidden" : ""
        } chatboxcontext`}
      >
        {!isOpen && (
          <button className="chatbot-icon" onClick={() => setIsOpen(true)}>
            <ChatBotIcon className="icon" />
          </button>
        )}

        {isOpen && (
          <div
            ref={chatAreaRef}
            className="chat-window"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            {/* Chat Header */}
            <div
              ref={dragRef}
              className="chat-header"
              onMouseDown={handleMouseDown}
            >
              <h1 className="chat-title cookie">
                <ChatBotIcon className="icon" />
                Helpie
              </h1>
              <div className="drag-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="close-button-div">
                <button
                  onClick={() => setIsOpen(false)}
                  className="close-button"
                >
                  <CrossIcon className="icon" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatboxref} className="chat-messages custom-scrollbar">
              {messages.length === 0 && (
                <div className="empty-chat">
                  <ChatBotIcon className="empty-icon" />
                  <h2
                    className={`empty-text ${
                      Api_key === "" ? "api-missing" : "cookie apicookiesize"
                    }`}
                  >
                    {Api_key === ""
                      ? "Please Enter your Gemini API Key in the extension's PopUp Dialog box."
                      : "Hello, I'm Helpie!"}
                  </h2>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.sender === "user" ? "user-message" : "bot-message"
                  }`}
                >
                  <div className="message-text">{message.text}</div>
                </div>
              ))}
              {isSending && (
                <div className="loading-indicator">
                  <ChatBotIcon className="icon" />
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className={`chat-input ${Api_key === "" ? "hidden" : ""}`}>
              <div className="input-container">
                {croppedImage && (
                  <div className="image-preview">
                    <span
                      className="close-preview"
                      onClick={() => setCroppedImage(null)}
                    >
                      <CrossIcon className="icon" />
                    </span>
                    <img src={croppedImage} alt="" className="preview-image" />
                  </div>
                )}
                <div
                  ref={inputRef}
                  contentEditable
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Helpie..."
                  className="input-field"
                />
                <button
                  id="ScreenShot"
                  onClick={captureViewport}
                  className="screenshot-button"
                >
                  <CropImage className="icon" />
                </button>
                <button
                  id="sendbtn"
                  disabled={isSending || inputcontent === ""}
                  onClick={handleSendMessage}
                  className={`send-button ${
                    isSending || inputcontent === "" ? "disabled" : ""
                  }`}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Screenshot Dialog */}
      {isDialogOpen && (
        <Croppercomp
          setCroppedImage={setCroppedImage}
          setIsDialogOpen={setIsDialogOpen}
          viewportScreenshot={viewportScreenshot}
          setViewportScreenshot={setViewportScreenshot}
          sethidechatbox={sethidechatbox}
        />
      )}
    </>
  );
}

export default ChatBot;

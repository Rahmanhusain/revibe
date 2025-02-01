import React from "react";
import { QuoteIconUp } from "../icons/icon";

function QouteComp() {
  const [quote, setQuote] = React.useState({ text: "", author: "" });

  React.useEffect(() => {
    fetch("https://go-quote.azurewebsites.net/")
      .then((response) => response.json())
      .then((data) => {
        setQuote({ text: data.text, author: data.author });
      })
      .catch((error) => console.error("Error fetching quote:", error));
  }, []);

  return (
    <div className="text-[var(--textColor)] text-2xl absolute bottom-7 left-7 cookie w-80 xl:w-96">
      <QuoteIconUp className="w-6 h-6 text-[var(--textColor)]" />
      {quote.text !== "" ? (
        <>
          <p className="pl-4 text-lg oregano text-[var(--textColor)] opacity-60 font-thin mt-5 min-h-5 leading-[1rem] line-clamp-3 overflow-y-auto custom-scrollbar">
            <strong>{quote.text}</strong>
          </p>
          <p className="pl-4 pt-1 text-base">~{quote.author}</p>
        </>
      ) : (
        <div className="flex space-x-2 items-center mt-5">
          <div className="h-2 w-2 bg-[var(--textColor)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-[var(--textColor)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-[var(--textColor)] rounded-full animate-bounce"></div>
        </div>
      )}
    </div>
  );
}

export default React.memo(QouteComp);

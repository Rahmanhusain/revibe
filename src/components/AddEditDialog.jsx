import React, { useState } from "react";

const AddEditDialog = ({ Mode, setIsOpen, isOpen, shortcuts, setShortcuts, selectedIndex }) => {
  const [closeanim, setcloseanim] = useState(false);
  const [name, setName] = useState(Mode === 'Edit' ? shortcuts[selectedIndex].name : '');
  const [url, setUrl] = useState(Mode === 'Edit' ? shortcuts[selectedIndex].url : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newShortcuts = [...shortcuts];
    if (Mode === 'Add') {
      newShortcuts.push({ name, url });
    } else {
      newShortcuts[selectedIndex] = { name, url };
    }
    setShortcuts(newShortcuts);
    setcloseanim(true);
    setTimeout(() => {
      setIsOpen(!isOpen);
    }, 450);
  };

  return (
    <div className="inset-0 fixed items-center justify-center flex">
      <div className={`w-96 bg-[#433838a5] rounded-lg p-6 text-white flex flex-col items-center ${
        !closeanim ? "animate-popInSimple" : "animate-popOutSimple"
      } ${closeanim && "scale-0"}`}>
        <h2 className="text-base font-bold mb-2 self-start">{Mode} Shortcut</h2>
        <form className="w-full flex flex-col" onSubmit={handleSubmit}>
          <label className="text-xs mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full font-thin text-gray-200 py-1 px-2 text-base outline-none rounded-md mb-4 bg-[#d9d9d935] placeholder-gray-200"
            placeholder="Enter Name"
            required
          />
          <label className="text-xs mb-1">URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full font-thin text-gray-200 py-1 px-2 text-base outline-none rounded-md mb-4 bg-[#d9d9d935] placeholder-gray-200"
            placeholder="Enter URL"
            required
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                setcloseanim(true);
                setTimeout(() => {
                  setIsOpen(!isOpen);
                }, 450);
              }}
              type="button"
              className="px-3 py-1.5 w-16 rounded-xl flex items-center justify-center bg-[#9a9a9b36] hover:bg-[#9a9a9b61] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 w-16 rounded-xl flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition"
            >
              {Mode}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(AddEditDialog);
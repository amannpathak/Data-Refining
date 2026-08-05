import { useState } from "react";

export default function AIPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6">

      <button
        onClick={() => setOpen(!open)}
        className="bg-purple-600 p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        🤖
      </button>

      {open && (
        <div className="mt-3 w-64 bg-white/10 backdrop-blur-lg p-4 rounded-xl text-white">
          <p className="text-sm">AI Assistant coming soon...</p>
        </div>
      )}

    </div>
  );
}
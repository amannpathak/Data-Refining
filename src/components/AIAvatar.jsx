import { useState } from "react";

export default function AIAvatar() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [listening, setListening] = useState(false);

  const data = JSON.parse(localStorage.getItem("uploadedData") || "[]");

  // 🎤 VOICE INPUT
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setMessage(text);
      sendToAI(text);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  // 🤖 SEND TO AI
  const sendToAI = async (text) => {
    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
          data: data,
        }),
      });

      const result = await res.json();

      setReply(result.reply);
      speak(result.reply);

    } catch (err) {
      console.error(err);
      alert("AI failed ❌");
    }
  };

  // 🔊 SPEAK
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.pitch = 1.3;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2">

      {/* CHAT BOX */}
      <div className="bg-black/80 p-4 rounded-xl w-72 text-white">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
          className="w-full p-2 bg-gray-800 rounded mb-2"
        />

        <button
          onClick={() => sendToAI(message)}
          className="w-full bg-purple-600 p-2 rounded"
        >
          Ask AI
        </button>

        {reply && (
          <p className="mt-2 text-sm">{reply}</p>
        )}
      </div>

      {/* AVATAR */}
      <div
        onClick={startListening}
        className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer
        ${listening ? "bg-red-500 animate-pulse" : "bg-purple-600 animate-bounce"}`}
      >
        🤖
      </div>

    </div>
  );
}
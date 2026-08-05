export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex flex-col items-center justify-center">

      <h1 className="text-5xl font-bold mb-6 text-center">
         Data Refining 
      </h1>

      <p className="text-gray-300 text-lg mb-8 text-center max-w-xl">
        Upload messy data → Get clean insights → Visualize instantly using AI
      </p>

      <a href="/upload">
        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-lg shadow-lg transition">
          Start Cleaning Data →
        </button>
      </a>

      <div className="grid grid-cols-3 gap-6 mt-16 px-10">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
          📂 Upload 
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
          🤖 AI Cleaning
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
          📊 Smart Dashboard
        </div>
      </div>

    </div>
  );
}
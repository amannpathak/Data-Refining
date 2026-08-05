import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full flex justify-between items-center px-10 py-4 bg-white/5 backdrop-blur-lg border-b border-white/10">
      <h1 className="text-xl font-bold text-white">⚡ DataRefiner</h1>

      <div className="space-x-6 text-gray-300">
        <Link to="/" className="hover:text-white">Home</Link>
        <Link to="/upload" className="hover:text-white">Upload</Link>
        <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
      </div>
    </div>
  );
}
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter all fields ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful ✅");
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Login failed ❌");
      }
    } catch (err) {
      alert("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">

      <div className="bg-[#1e293b] p-8 rounded-2xl w-80 shadow-xl">
        <h1 className="text-2xl mb-6 text-center">🔐 Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded bg-[#0f172a]"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-[#0f172a]"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 p-3 rounded-xl"
        >
          Login
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Demo: test@test.com / 1234
        </p>
      </div>

    </div>
  );
}
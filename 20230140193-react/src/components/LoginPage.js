// src/components/LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const LOGO_URL = "/logo-apotek.jpeg";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        username: username,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-cyan-100 to-lime-50 text-gray-800 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0">
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/15 blur-[150px] rounded-full top-[-80px] left-[-100px] transform rotate-45"></div>
        <div className="absolute w-[350px] h-[350px] bg-lime-500/15 blur-[130px] rounded-full bottom-[-90px] right-[-110px]"></div>
      </div>

      {/* Kotak Login */}
      <div className='relative z-10 w-full max-w-md p-8 bg-white/95 border border-cyan-200 rounded-3xl shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.4)] transition-all duration-300 backdrop-blur-sm'>
        
        {/* Logo + Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-3 rounded-2xl shadow-lg mb-4 border-2 border-cyan-100">
            <img
              src={LOGO_URL}
              alt="Logo Apotek Hadinata"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-4xl font-black text-center text-cyan-700">
            APOTEK <span className="text-lime-600">HADINATA</span>
          </h2>
          <p className="text-sm text-slate-600 mt-2">Admin Login System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-bold text-cyan-900 mb-2 uppercase">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-gray-800 border-2 border-cyan-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition placeholder-gray-400 outline-none"
              placeholder="Masukkan username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-cyan-900 mb-2 uppercase">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-gray-800 border-2 border-cyan-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition placeholder-gray-400 outline-none"
              placeholder="Masukkan password"
            />
          </div>

          {/* Button Login */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:from-cyan-700 hover:to-cyan-600 hover:scale-[1.02] transition transform duration-200 flex items-center justify-center space-x-2"
          >
            <span className="text-xl">🔐</span>
            <span>Masuk Sistem</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Belum punya akun?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-cyan-600 hover:text-cyan-700 hover:underline cursor-pointer font-bold"
          >
            Daftar di sini
          </span>
        </p>

        <p className="text-xs text-gray-400 mt-4 text-center border-t border-slate-200 pt-4">
          Apotek Hadinata Admin System V1.0
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
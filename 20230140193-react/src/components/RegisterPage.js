// src/components/RegisterPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const LOGO_URL = "/logo-apotek.jpeg";
  const role = "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        nama,
        username,
        password,
        role,
      });

      alert("Registrasi admin berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message || "Registrasi gagal."
        : "Gagal terhubung ke server.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-cyan-100 to-lime-50 text-gray-800 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0">
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/15 blur-[150px] rounded-full top-[-80px] left-[-100px] transform rotate-45"></div>
        <div className="absolute w-[350px] h-[350px] bg-lime-500/15 blur-[130px] rounded-full bottom-[-90px] right-[-110px]"></div>
      </div>

      {/* Kotak Register */}
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
            DAFTAR <span className="text-lime-600">ADMIN</span>
          </h2>
          <p className="text-sm text-slate-600 mt-2">Registrasi Akun Administrator</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-sm font-bold text-cyan-900 mb-2 uppercase">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-gray-800 border-2 border-cyan-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition placeholder-gray-400 outline-none"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-bold text-cyan-900 mb-2 uppercase">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-gray-800 border-2 border-cyan-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition placeholder-gray-400 outline-none"
              placeholder="Buat username admin"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-cyan-900 mb-2 uppercase">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-gray-800 border-2 border-cyan-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition placeholder-gray-400 outline-none"
              placeholder="Buat password"
            />
          </div>

          {/* Role Display */}
          <div className="p-4 bg-cyan-50 rounded-xl border-l-4 border-cyan-600">
            <p className="font-bold text-cyan-900 text-sm">Role: Administrator</p>
            <p className="text-cyan-700 text-xs mt-1">Akun dengan akses penuh ke sistem</p>
          </div>

          {/* Button Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-lime-500 to-lime-600 text-white font-bold rounded-xl shadow-lg hover:from-lime-600 hover:to-lime-700 hover:scale-[1.02] transition transform duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Mendaftar...</span>
              </>
            ) : (
              <>
                <span className="text-xl">✨</span>
                <span>Daftar Admin</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Sudah punya akun?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-600 hover:text-cyan-700 hover:underline cursor-pointer font-bold"
          >
            Login di sini
          </span>
        </p>

        <p className="text-xs text-gray-400 mt-4 text-center border-t border-slate-200 pt-4">
          Apotek Hadinata Admin System V1.0
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
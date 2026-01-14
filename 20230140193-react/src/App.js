import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import ObatPage from "./components/ObatPage";
import PublicPage from "./components/PublicPage";
import UnggahResep from "./components/UnggahResep";
import ResepReport from "./admin/ResepReport";
import KatalogObatPage from "./pages/KatalogObatPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* --- HALAMAN PUBLIK (USER) --- */}
        <Route path="/" element={<PublicPage />} />
        <Route path="/unggah-resep" element={<UnggahResep />} />

        {/* Pastikan path ini sesuai dengan "to='/semua-obat'" di PublicPage */}
        <Route path="/semua-obat" element={<KatalogObatPage />} />

        {/* --- AUTHENTICATION --- */}
        <Route path="/login" element={<LoginPage />} />
        {/* Route register dihapus karena admin bersifat tetap */}

        {/* --- ADMIN ROUTES (DILINDUNGI) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/obat" element={<ObatPage />} />
          <Route path="/admin/resep" element={<ResepReport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    // Cek apakah ada token. Di masa depan bisa ditambah pengecekan role di sini.
    if (!token) {
        // Jika tidak ada token, arahkan paksa ke halaman login
        return <Navigate to="/login" replace />;
    }

    // Jika ada token, izinkan masuk ke halaman yang diminta (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;

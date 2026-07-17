import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user && user?.roles?.includes("ROLE_SELLER");
    const location = useLocation();

    // Public pages (login/register)
    if (publicPage) {
        return user ? <Navigate to="/" replace /> : <Outlet />
    }

    // User must be logged in
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Admin Routes
    if (adminOnly) {

        // Customer cannot access admin pages
        if (!isAdmin && !isSeller) {
            return <Navigate to="/" replace />
        }

        // Seller restrictions
        if (isSeller && !isAdmin) {
            const sellerAllowedPaths = ["/admin/orders", "/admin/products"];
            const sellerAllowed = sellerAllowedPaths.some(path => 
                location.pathname.startsWith(path)
            );
            if (!sellerAllowed) {
                return <Navigate to="/" replace />
            }
        }
    }

    return <Outlet />
}

export default PrivateRoute
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getProfile, loginSuccess, setInitialized } from "@/store/slices/authSlice";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, user, loading, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // 1. On mount, load credentials from storage
    const savedToken = sessionStorage.getItem("token") || localStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user") || localStorage.getItem("user");

    if (savedToken) {
      let parsedUser = null;
      if (savedUser) {
        try {
          parsedUser = JSON.parse(savedUser);
        } catch (e) {
          console.error("Failed to parse user", e);
        }
      }
      dispatch(loginSuccess({ token: savedToken, user: parsedUser }));
    } else {
      // Safely mark auth as initialized without clearing guest localstorage
      dispatch(setInitialized());
    }
  }, [dispatch]);

  useEffect(() => {
    // 2. Fetch fresh profile only after auth state is initialized and token is present
    if (isInitialized && token && !user && !loading) {
      dispatch(getProfile());
    }

    // Clean up legacy admin tokens from localStorage so new tabs ask for login correctly
    if (isInitialized && user?.role === 'admin' && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user, loading, isInitialized, dispatch]);

  useEffect(() => {
    const handleUnload = () => {
      if (user?.email) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tilebazaardemowork-production.up.railway.app';
        const url = `${baseUrl}/api/auth/logout`;
        const payload = JSON.stringify({ email: user.email });
        
        // Use sendBeacon for reliable delivery during page unload
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
        
        // We do NOT clear tokens here, because this event fires on page reload too!
        // Using sessionStorage in the app ensures tokens are cleared when the tab actually closes.
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [user]);

  return <>{children}</>;
}
"use client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <Provider store={store}>
        <CartProvider>
          <AuthProvider>
            <Toaster position="bottom-right" reverseOrder={false} />
            {children}
          </AuthProvider>
        </CartProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}
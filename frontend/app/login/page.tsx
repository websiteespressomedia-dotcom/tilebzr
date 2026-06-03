"use client";
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, googleLoginUser, verifyOtp } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, isOtpRequired, pendingUserEmail } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(result)) {
      if (result.payload.status === 'OTP_REQUIRED') {
        // Handled by state automatically
        return;
      }

      const user = result.payload.user;
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      console.error("Login failed:", result.payload || result.error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const result = await dispatch(googleLoginUser(credentialResponse.credential));
      if (googleLoginUser.fulfilled.match(result)) {
        if (result.payload.status === 'OTP_REQUIRED') {
          // Handled by state automatically
          return;
        }

        const user = result.payload.user;
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        const errorMsg = result.payload as string;
        if (errorMsg && errorMsg.includes('Please register first')) {
          router.push('/register');
        } else {
          console.error("Google login failed:", result.payload || result.error);
        }
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pendingUserEmail || !otpCode) return;

    const result = await dispatch(verifyOtp({ email: pendingUserEmail, otp: otpCode }));
    if (verifyOtp.fulfilled.match(result)) {
      const user = result.payload.user;
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      console.error("OTP Verification failed:", result.payload || result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-10 shadow-sm border border-gray-100">
        <h2 className="text-3xl font-serif text-[#4a2c2a] text-center mb-2">Welcome Back</h2>
        <p className="text-center text-[11px] text-[#4a2c2a] uppercase tracking-widest opacity-50 mb-8">
          {isOtpRequired ? 'Two-Factor Authentication' : 'Sign in to your account'}
        </p>

        {isOtpRequired ? (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] text-[#4a2c2a] font-bold uppercase tracking-tight opacity-60">
                Enter 6-digit Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="000000"
                className="w-full mt-1 p-3 text-[#4a2c2a] border-b border-gray-200 focus:border-[#4a2c2a] outline-none transition-colors text-center tracking-[0.5em] text-lg font-bold"
              />
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                We sent a secure code to <strong>{pendingUserEmail}</strong>.
              </p>
            </div>

            {error && <p className="text-red-500 text-[11px] font-bold uppercase text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full bg-[#4a2c2a] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] text-[#4a2c2a] font-bold uppercase tracking-tight opacity-60">Email Address</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full mt-1 p-3 text-[#4a2c2a] border-b border-gray-200 focus:border-[#4a2c2a] outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-[#4a2c2a] font-bold uppercase tracking-tight opacity-60">Password</label>
                  <Link href="/forgot-password" className="text-[10px] uppercase font-bold text-[#4a2c2a] hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                <input 
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 p-3 text-[#4a2c2a] border-b border-gray-200 focus:border-[#4a2c2a] outline-none transition-colors text-sm"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4a2c2a] transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 p-4 border-l-2 border-red-500 mb-6 flex flex-col items-center">
                  <p className="text-red-600 text-[11px] font-bold uppercase text-center">
                    {error}
                  </p>
                </div>
              )}

              <button 
                type="submit" disabled={loading}
                className="w-full bg-[#4a2c2a] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <span className="text-xs text-center text-gray-500 uppercase tracking-widest">Or continue with</span>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log('Google Login Failed');
                }}
              />
            </div>
            
            <p className="mt-8 text-center text-xs text-gray-500">
              Don&apos;t have an account? <Link href="/register" className="text-[#4a2c2a] font-bold hover:underline">Register Now</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser, googleRegisterUser, googleLoginUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { GoogleLogin } from '@react-oauth/google';

const COUNTRY_CODES = [
  { code: "+44", label: "UK (+44)" },
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "US/CA (+1)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+966", label: "Saudi (+966)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+86", label: "China (+86)" },
  { code: "+353", label: "Ireland (+353)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+92", label: "Pakistan (+92)" },
  { code: "+880", label: "Bangladesh (+880)" },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: ''
  });

  const [countryCode, setCountryCode] = useState('+44');
  const [googleCountryCode, setGoogleCountryCode] = useState('+44');

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Google Auth States
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [googlePhoneNumber, setGooglePhoneNumber] = useState('');

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error } = useAppSelector(
    (state) => state.auth
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setValidationError(''); // Clear validation error when user types
  };

  const validatePhone = (phone: string) => {
    return phone.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    let cleanPhone = formData.phone_number.trim();
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.slice(1);
    }

    const fullPhoneNumber = `${countryCode}${cleanPhone}`;
    const submissionData = {
      ...formData,
      phone_number: fullPhoneNumber
    };

    const result = await dispatch(registerUser(submissionData));

    if (registerUser.fulfilled.match(result)) {
      const data = result.payload;
      if (data?.token) localStorage.setItem('token', data.token);
      if (data?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      console.error('Registration failed:', (result as any).payload || (result as any).error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setValidationError('');
      const result = await dispatch(googleLoginUser(credentialResponse.credential));
      if (googleLoginUser.fulfilled.match(result)) {
        const user = result.payload.user;
        if (user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        const errorMsg = (result as any).payload as string;
        if (errorMsg && errorMsg.includes('Please register first')) {
          setGoogleToken(credentialResponse.credential);
        } else {
          console.error("Google register failed:", (result as any).payload || (result as any).error);
          setValidationError(typeof result.payload === 'string' ? result.payload : 'Google login failed');
        }
      }
    }
  };
  
  const handleGoogleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    if (!googleToken || !googlePhoneNumber) return;

    let cleanPhone = googlePhoneNumber.trim();
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.slice(1);
    }
    
    const fullPhoneNumber = `${googleCountryCode}${cleanPhone}`;
    const result = await dispatch(googleRegisterUser({ token: googleToken, phone_number: fullPhoneNumber }));
    if (googleRegisterUser.fulfilled.match(result)) {
      const user = result.payload.user;
      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      console.error("Google register failed:", (result as any).payload || (result as any).error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 sm:p-10 shadow-sm border border-gray-100">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-serif text-[#4a2c2a] mb-2">
            {googleToken ? 'Almost there!' : 'Create Account'}
          </h2>
          <p className="text-[11px] uppercase tracking-widest opacity-50">
            {googleToken ? 'Please provide your phone number' : 'Join the TileBazaar community'}
          </p>
        </header>

        {googleToken ? (
          <form onSubmit={handleGoogleRegisterSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone_number" className="text-[10px] text-[#4a2c2a] font-bold uppercase tracking-tight opacity-60">
                Mobile Number
              </label>
              <div className="flex gap-2 mt-1">
                <select
                  value={googleCountryCode}
                  onChange={(e) => setGoogleCountryCode(e.target.value)}
                  className="p-3 text-[#4a2c2a] border-b border-gray-200 focus:border-[#4a2c2a] outline-none text-sm bg-white cursor-pointer"
                >
                  {COUNTRY_CODES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <input
                  id="phone_number"
                  type="tel"
                  required
                  placeholder="7123456789"
                  value={googlePhoneNumber}
                  onChange={(e) => {
                    setGooglePhoneNumber(e.target.value);
                    setValidationError('');
                  }}
                  className="flex-1 p-3 text-[#4a2c2a] border-b border-gray-200 focus:border-[#4a2c2a] outline-none text-sm transition-colors"
                />
              </div>
            </div>
            
            {validationError && (
              <div className="bg-red-50 p-3 border-l-2 border-red-500">
                <p className="text-red-600 text-[10px] font-bold uppercase leading-relaxed">
                  {validationError}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 p-3 border-l-2 border-red-500">
                <p className="text-red-600 text-[10px] font-bold uppercase leading-relaxed">
                  {error}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4a2c2a] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Complete Registration'}
            </button>
            <button
              type="button"
              onClick={() => setGoogleToken(null)}
              className="w-full mt-4 bg-transparent text-[#4a2c2a] border border-[#4a2c2a] py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="text-[10px] text-[#4a2c2a] font-bold uppercase tracking-tight opacity-60">
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 text-[#4a2c2a] border-b border-gray-200 focus:border-[#4a2c2a] outline-none text-sm transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-[10px] text-[#4a2c2a] font-bold uppercase tracking-tight opacity-60">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 text-[#4a2c2a] border-b border-gray-200 focus:border-[#4a2c2a] outline-none text-sm transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-[10px] text-[#4a2c2a] font-bold uppercase tracking-tight opacity-60">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 pr-10 text-[#4a2c2a] border-b border-gray-200 focus:border-[#4a2c2a] outline-none text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4a2c2a] transition-colors p-1"
                  >
                    {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="phone_number" className="text-[10px] text-[#4a2c2a] font-bold uppercase tracking-tight opacity-60">
                  Mobile Number
                </label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="p-3 text-[#4a2c2a] border-b border-gray-200 focus:border-[#4a2c2a] outline-none text-sm bg-white cursor-pointer"
                  >
                    {COUNTRY_CODES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    required
                    placeholder="7123456789"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="flex-1 p-3 text-[#4a2c2a] border-b border-gray-200 focus:border-[#4a2c2a] outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              {validationError && (
                <div className="bg-red-50 p-3 border-l-2 border-red-500">
                  <p className="text-red-600 text-[10px] font-bold uppercase leading-relaxed">
                    {validationError}
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 p-3 border-l-2 border-red-500">
                  <p className="text-red-600 text-[10px] font-bold uppercase leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4a2c2a] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Register'}
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
          </>
        )}

        {!googleToken && (
          <footer className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-[#4a2c2a] font-bold hover:underline">
                Login
              </Link>
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

// In-memory OTP store: Map<email, { code: string, expires: number, type: 'login' | 'register', registrationData?: any }>
export const otpStore = new Map<string, { code: string, expires: number, type: 'login' | 'register', registrationData?: any }>();

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ message: 'No OTP found for this email. Please try logging in again.' });
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired. Please try logging in again.' });
    }

    if (storedData.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid! Remove it from store
    otpStore.delete(email);

    // If it's a registration, we need to insert the user into the database first
    if (storedData.type === 'register' && storedData.registrationData) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([storedData.registrationData])
        .select()
        .single();

      if (insertError || !newUser) {
        console.error('Error inserting user after OTP:', insertError);
        return res.status(500).json({ message: 'Failed to create user account' });
      }

      // Generate custom JWT for the new user
      const jwtToken = jwt.sign(
        { id: newUser.id, role: newUser.role || 'customer' },
        process.env.JWT_SECRET || 'tile_secret_key',
        { expiresIn: '7d' }
      );

      const userResponse = { ...newUser };
      delete userResponse.password;

      return res.status(201).json({
        message: 'Registration successful',
        token: jwtToken,
        user: userResponse
      });
    }

    // Otherwise, it's a login, fetch the existing user
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!user || error) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate custom JWT
    const jwtToken = jwt.sign(
      { id: user.id, role: user.role || 'customer' },
      process.env.JWT_SECRET || 'tile_secret_key',
      { expiresIn: '7d' }
    );

    const userResponse = { ...user };
    delete userResponse.password;

    res.status(200).json({
      message: 'Login successful',
      token: jwtToken,
      user: userResponse
    });

  } catch (err: any) {
    console.error('OTP Verification Error:', err);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

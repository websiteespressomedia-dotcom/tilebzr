import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required." });
    }

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();

    if (error || !coupon) {
      return res.status(400).json({ message: "Invalid or expired coupon code." });
    }

    res.status(200).json({
      message: 'Coupon is valid',
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value
      }
    });

  } catch (err: any) {
    console.error("Validate Coupon Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

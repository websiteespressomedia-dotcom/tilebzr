import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

// 1. Add or Update Item in Cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { product_id, quantity, unit = 'sqm' } = req.body;
    const user_id = (req as any).user.id;

    // 1. Check if the item exists
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .maybeSingle(); // Use maybeSingle to avoid 406 errors if not found

    let result;
    if (existingItem) {
      // 2. Update existing
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select().single();
      if (error) throw error;
      result = data;
    } else {
      // 3. Insert new
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ user_id, product_id, quantity, unit })
        .select().single();
      if (error) throw error;
      result = data;
    }

    res.status(200).json({ message: 'Cart updated', item: result });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Get User's Cart with Product Details
export const getMyCart = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.id;

    // Fetching with product details
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        unit,
        product:products (
          id,
          name,
          price,
          discount_price,
          image,
          size
        )
      `)
      .eq('user_id', user_id);

    if (error) throw error;

    // Calculate Cart Total on the fly for the frontend
    const cartTotal = data?.reduce((acc, item: any) => {
      const price = item.product?.discount_price || 0;
      return acc + (price * item.quantity);
    }, 0);

    res.status(200).json({
      items: data,
      cartTotal: Number(cartTotal.toFixed(2)),
      vatEstimate: Number((cartTotal * 0.20).toFixed(2))
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Remove Item from Cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Cart Item ID
    const user_id = (req as any).user.id;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id); // Security: Ensure they own the cart item

    if (error) throw error;
    res.status(200).json({ message: 'Item removed' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Update Quantity (Direct Update)
export const updateCartQuantity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // The cart item UUID
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    res.status(200).json({ message: 'Quantity updated', item: data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
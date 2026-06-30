import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCart() {
  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      product_id,
      quantity,
      product:products (
        id,
        name,
        image,
        size,
        category
      )
    `);

  if (error) {
    console.error("Error fetching cart items:", error);
    return;
  }

  console.log("Cart Items in database:");
  for (const item of cartItems) {
    console.log(`- Item ID: ${item.id}, Product ID: ${item.product_id}, Quantity: ${item.quantity}`);
    if (item.product) {
      console.log(`  Product Name: "${item.product.name}", Size: "${item.product.size}", Category: "${item.product.category}", Image: "${item.product.image}"`);
    } else {
      console.log(`  Product: NULL`);
    }
  }
}

checkCart();

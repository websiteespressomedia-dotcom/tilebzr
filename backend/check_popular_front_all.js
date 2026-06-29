import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function run() {
  console.log("Checking all products matching popular, front, or fornte...");
  const { data: products, error } = await supabase
    .from('products')
    .select('*');
    
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  const matches = products.filter(p => {
    const name = (p.name || "").toLowerCase();
    const image = (p.image || "").toLowerCase();
    return name.includes("popular") || name.includes("front") || name.includes("fornte") ||
           image.includes("popular") || image.includes("front") || image.includes("fornte");
  });
  
  console.log("Matches found:", JSON.stringify(matches, null, 2));
}

run();

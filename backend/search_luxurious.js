import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function run() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', '%luxurious blue%');
    
  if (error) {
    console.error(error);
    return;
  }
  
  console.log("Luxurious Blue products:");
  console.log(JSON.stringify(products.map(p => ({ id: p.id, name: p.name, price: p.price, size: p.size, finish: p.finish, image: p.image, active: p.is_active })), null, 2));
}

run();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function run() {
  console.log("Checking OK (2) and BIANCO STRITO...");
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, image, size, category')
    .or('name.ilike.%OK%,name.ilike.%BIANCO STRITO%,name.ilike.%STRITO%');
    
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  console.log(JSON.stringify(data, null, 2));
}

run();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function run() {
  console.log("Checking products database...");
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, image, size, finish');
    
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  console.log(`Total products in Supabase: ${data.length}`);
  
  const searchNames = ["SERENA", "CARRARA", "CREMA MARFIL", "OK", "ORIOL", "PASSION PULPIS", "SNOW WHITE"];
  const matches = data.filter(p => 
    p.name && searchNames.some(name => p.name.toUpperCase().includes(name))
  );
  
  console.log("\nMatching Products:");
  console.log(JSON.stringify(matches, null, 2));
}

run();

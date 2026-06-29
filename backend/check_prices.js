import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function run() {
  console.log("Checking EXP, TC and Outdoor tiles...");
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, image, size, category, price');
    
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  const expTiles = data.filter(p => (p.name || "").toUpperCase().includes("EXP"));
  const tcTiles = data.filter(p => (p.name || "").toUpperCase().includes("TC"));
  const outdoorTiles = data.filter(p => (p.category || "").toUpperCase().includes("OUTDOOR") || (p.name || "").toUpperCase().includes("OUTDOOR"));
  
  console.log("EXP Tiles:", JSON.stringify(expTiles, null, 2));
  console.log("TC Tiles:", JSON.stringify(tcTiles, null, 2));
  console.log("Outdoor Tiles:", JSON.stringify(outdoorTiles, null, 2));
}

run();

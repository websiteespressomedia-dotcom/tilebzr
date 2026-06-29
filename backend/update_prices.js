import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function run() {
  console.log("Updating EXP, TC and Outdoor tile prices in database...");
  
  // 1. Fetch all products
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, name, category, price');
    
  if (fetchError) {
    console.error("Error fetching products:", fetchError);
    return;
  }
  
  let updatedCount = 0;
  
  for (const p of products) {
    const nameUpper = (p.name || "").toUpperCase();
    const catUpper = (p.category || "").toUpperCase();
    
    let targetPrice = null;
    
    // Check if it's an EXP tile or TC tile
    if (nameUpper.includes("EXP") || nameUpper.includes("TC")) {
      targetPrice = 10;
    }
    // Check if it's an Outdoor tile
    else if (catUpper.includes("OUTDOOR") || nameUpper.includes("PAVE") || nameUpper.includes("SALTED CONCRETO") || nameUpper.includes("AURL GRIGIO")) {
      targetPrice = 18;
    }
    
    if (targetPrice !== null && p.price !== targetPrice) {
      console.log(`Updating product "${p.name}" (ID: ${p.id}) price from ${p.price} to ${targetPrice}`);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ price: targetPrice })
        .eq('id', p.id);
        
      if (updateError) {
        console.error(`Failed to update ${p.name}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }
  
  console.log(`Successfully updated prices for ${updatedCount} products in the database.`);
}

run();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function run() {
  console.log("Deleting duplicate product 'The Popular Front' (ID: f998a607-8b32-4a48-8e3d-6e48d1213e96) with spacer image...");
  
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', 'f998a607-8b32-4a48-8e3d-6e48d1213e96')
    .select();
    
  if (error) {
    console.error("Error deleting product:", error);
  } else {
    console.log("Deleted product details:", JSON.stringify(data, null, 2));
  }

  // Delete the spacer file locally so it won't get synced again
  const filePath = 'c:/final_tilebazaar_backup/Tilebazaar_current/frontend/public/tiles/accessories/spacer/the-popular-front--spacer.png';
  if (fs.existsSync(filePath)) {
    console.log("Deleting local file:", filePath);
    fs.unlinkSync(filePath);
    console.log("Local file deleted successfully.");
  } else {
    console.log("Local file not found at:", filePath);
  }
}

run();

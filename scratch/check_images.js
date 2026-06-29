import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '../backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function run() {
  console.log("Checking all active products for missing images...");
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, image, size, category');
    
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  console.log(`Total products in Supabase: ${data.length}`);
  
  const missing = [];
  
  for (const p of data) {
    if (!p.image) {
      missing.push({ id: p.id, name: p.name, reason: "No image field in DB" });
      continue;
    }
    
    // Determine the expected local path
    // For 1200x1200 sizes, or other sizes:
    const sizeFolder = (p.size || "other").toLowerCase().replace(/\s/g, "");
    
    // Check if the image path is structured or just filename
    let localPath = "";
    if (p.image.startsWith("http")) {
      // remote image, skip local check or note it
      continue;
    }
    
    // Let's resolve the path similarly to resolveTileImagePath in frontend
    // resolveTileImagePath(imageName, size, category)
    // if imageName starts with size/ folder already:
    let imageName = p.image;
    let sizeParam = sizeFolder;
    
    let resolvedSubpath = "";
    if (imageName.startsWith("1200x1200/") || imageName.startsWith("600x1200/") || imageName.startsWith("600x600/") || imageName.startsWith("300x600/")) {
      resolvedSubpath = imageName;
    } else if (sizeParam === "accessories" || p.category?.toLowerCase() === "accessories") {
      // Accessories has its own subfolders like accessories/adhesive/ etc.
      // But let's check if imageName has a slash or is a direct filename.
      if (imageName.includes("/")) {
        resolvedSubpath = imageName;
      } else {
        // We'll search for it
        resolvedSubpath = `accessories/${imageName}`;
      }
    } else {
      resolvedSubpath = `${sizeParam}/${imageName}`;
    }
    
    const fullPath = path.join('c:/final_tilebazaar_backup/Tilebazaar_current/frontend/public/tiles', resolvedSubpath);
    const exists = fs.existsSync(fullPath);
    
    if (!exists) {
      // Try fallback or check if it exists in any folder under public/tiles/
      // Let's do a quick search in all directories
      let foundInFolder = "";
      const searchDirs = ['1200x1200', '600x1200', '600x600', '300x600', 'accessories/trim', 'accessories/spacer', 'accessories/matting', 'accessories/adhesive'];
      for (const dir of searchDirs) {
        if (fs.existsSync(path.join('c:/final_tilebazaar_backup/Tilebazaar_current/frontend/public/tiles', dir, imageName))) {
          foundInFolder = dir;
          break;
        }
      }
      
      if (foundInFolder) {
        // Image exists but in a different folder than sizeParam suggests
        // This might be ok if resolveTileImagePath handles it, or it might be mismatch.
      } else {
        missing.push({
          id: p.id,
          name: p.name,
          image: p.image,
          size: p.size,
          expectedPath: resolvedSubpath
        });
      }
    }
  }
  
  console.log(`\nFound ${missing.length} products with missing images:`);
  console.log(JSON.stringify(missing, null, 2));
}

run();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

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
    
    const sizeFolder = (p.size || "other").toLowerCase().replace(/\s/g, "");
    let imageName = p.image;
    let sizeParam = sizeFolder;
    
    let resolvedSubpath = "";
    if (imageName.startsWith("1200x1200/") || imageName.startsWith("600x1200/") || imageName.startsWith("600x600/") || imageName.startsWith("300x600/")) {
      resolvedSubpath = imageName;
    } else if (sizeParam === "accessories" || p.category?.toLowerCase() === "accessories") {
      if (imageName.includes("/")) {
        resolvedSubpath = imageName;
      } else {
        resolvedSubpath = `accessories/${imageName}`;
      }
    } else {
      resolvedSubpath = `${sizeParam}/${imageName}`;
    }
    
    // Resolve relative path to frontend public tiles folder
    const fullPath = path.resolve('..', 'frontend', 'public', 'tiles', resolvedSubpath);
    const exists = fs.existsSync(fullPath);
    
    if (!exists) {
      // Check if file exists under any folder
      let foundInFolder = "";
      const searchDirs = ['1200x1200', '600x1200', '600x600', '300x600', 'accessories/trim', 'accessories/spacer', 'accessories/matting', 'accessories/adhesive'];
      for (const dir of searchDirs) {
        const potentialPath = path.resolve('..', 'frontend', 'public', 'tiles', dir, imageName);
        if (fs.existsSync(potentialPath)) {
          foundInFolder = dir;
          break;
        }
      }
      
      if (!foundInFolder) {
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

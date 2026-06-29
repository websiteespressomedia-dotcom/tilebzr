import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function run() {
  console.log("Checking all accessories...");
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, image, size, category');
    
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  const accessories = data.filter(p => {
    const cat = (p.category || "").toUpperCase();
    const name = (p.name || "").toUpperCase();
    return cat === "ACCESSORIES" || cat === "ACCESORIES" || /TRIM|SPACER|WEDGE|ADHESIVE|GLUE|MATTING|LEVEL/.test(name);
  });
  
  console.log(`Total accessories found: ${accessories.length}`);
  console.log(JSON.stringify(accessories, null, 2));
}

run();

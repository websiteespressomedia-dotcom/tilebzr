const fs = require('fs');
let code = fs.readFileSync('c:/final_tilebazaar_backup/Tilebazaar_current/backend/src/controllers/paymentController.ts', 'utf8');

const helpers = `
const getFinish = (fileName: string) => {
  const name = fileName.toUpperCase();
  if (name.includes('--GLOSS')) return "GLOSSY";
  if (name.includes('--MATT')) return "MATT";
  if (name.includes('--CARVING')) return "CARVING";
  if (name.includes('--HIGHGL')) return "HIGH GLOSS";
  if (name.includes('--PUNCHGL')) return "PUNCH GLOSSY";
  return "GLOSSY";
};

const getProductDetails = (fileName: string) => {
  const upper = fileName.toUpperCase();
  if (upper.includes("TRIM")) return { price: 8 };
  if (upper.includes("SPACER") || upper.includes("WEDGE") || upper.includes("MATTING") || upper.includes("LEVEL")) return { price: 6 };
  if (upper.includes("ADHESIVE") || upper.includes("GLUE")) return { price: 12 };
  return { price: 15 };
};

const getCategory = (fileName: string) => {
  const upper = fileName.toUpperCase();
  if (upper.includes("TRIM") || upper.includes("SPACER") || upper.includes("WEDGE") || upper.includes("ADHESIVE") || upper.includes("GLUE") || upper.includes("MATTING") || upper.includes("LEVEL")) return "accessories";
  if (upper.includes("OUTDOOR")) return "Outdoor";
  if (upper.includes("DECOR") || upper.includes("POSTER")) return "Decorative";
  return "Tiles";
};

const autoRegisterProduct = async (cleanFileName: string) => {
  const displayName = cleanFileName.split('--')[0].replace(/\\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\\s+/g, ' ').trim();
  const expectedSlug = cleanFileName.toLowerCase();
  
  const { data: existing } = await supabase
    .from('products')
    .select('id, name, image, price, discount_price, category, size')
    .eq('slug', expectedSlug)
    .maybeSingle();
    
  if (existing) return existing;

  const category = getCategory(cleanFileName);
  const size = cleanFileName.toUpperCase().includes("600X1200") ? "600X1200" : (cleanFileName.toUpperCase().includes("600X600") ? "600X600" : "600X600");
  const finish = getFinish(cleanFileName);
  const details = getProductDetails(cleanFileName);
  
  const { data: newProduct } = await supabase
    .from('products')
    .insert([{
      name: displayName,
      slug: expectedSlug,
      description: 'Premium quality tile/accessory.',
      price: details.price,
      discount_price: 0,
      stock: 1000,
      category: category,
      finish: finish,
      size: size,
      thickness: '9mm',
      material: 'Porcelain',
      image: cleanFileName,
      is_active: true
    }])
    .select('id, name, image, price, discount_price, category, size')
    .single();
    
  return newProduct;
};
`;

code = code.replace('const checkIsAccessory', helpers + '\nconst checkIsAccessory');

const searchStr = `if (data) dbProducts = [...dbProducts, ...data];
      }

      if (dbProducts.length === 0) {
        return res.status(400).json({ message: "Failed to retrieve product details." });
      }`;

const repl = `if (data) dbProducts = [...dbProducts, ...data];
        
        for (const fname of filenames) {
          if (!dbProducts.find(p => p.image === fname || p.slug === fname.toLowerCase())) {
            const newProd = await autoRegisterProduct(fname);
            if (newProd) dbProducts.push(newProd);
          }
        }
      }`;

code = code.split(searchStr).join(repl);

fs.writeFileSync('c:/final_tilebazaar_backup/Tilebazaar_current/backend/src/controllers/paymentController.ts', code);
console.log('Done!');

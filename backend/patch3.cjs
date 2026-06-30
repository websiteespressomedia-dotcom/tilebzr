const fs = require('fs');
let code = fs.readFileSync('c:/final_tilebazaar_backup/Tilebazaar_current/backend/src/controllers/paymentController.ts', 'utf8');

code = code.replace(
  'const autoRegisterProduct = async (cleanFileName: string) => {', 
  'const autoRegisterProduct = async (cleanFileName: string) => {\n  if (!cleanFileName || typeof cleanFileName !== "string") return null;'
);

code = code.replace(
  /const productIds = bodyCartItems.map\(\(item: any\) => item\.product_id\);/g, 
  'const productIds = bodyCartItems.map((item: any) => item.product_id || (item.product && item.product.id) || (item.product && item.product.image) || item.image).filter(Boolean);'
);

fs.writeFileSync('c:/final_tilebazaar_backup/Tilebazaar_current/backend/src/controllers/paymentController.ts', code);
console.log('Done!');

const fs = require('fs');
let code = fs.readFileSync('c:/final_tilebazaar_backup/Tilebazaar_current/backend/src/controllers/paymentController.ts', 'utf8');

// Remove autoRegisterProduct helper
const autoRegStart = 'const autoRegisterProduct = async (cleanFileName: string) => {';
const autoRegEnd = '};\n\nconst checkIsAccessory = (product: any): boolean => {';
const autoRegBlock = code.substring(code.indexOf(autoRegStart), code.indexOf(autoRegEnd) + 3);
code = code.replace(autoRegBlock, '');

// Remove the loop that calls it
const loopStr = `        for (const fname of filenames) {
          if (!dbProducts.find(p => p.image === fname || p.slug === fname.toLowerCase())) {
            const newProd = await autoRegisterProduct(fname);
            if (newProd) dbProducts.push(newProd);
          }
        }`;
code = code.split(loopStr).join('');

fs.writeFileSync('c:/final_tilebazaar_backup/Tilebazaar_current/backend/src/controllers/paymentController.ts', code);
console.log('Done!');

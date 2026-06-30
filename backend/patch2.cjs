const fs = require('fs');
let code = fs.readFileSync('c:/final_tilebazaar_backup/Tilebazaar_current/backend/src/controllers/paymentController.ts', 'utf8');

const searchRegex1 = /if \(\!userId\) \{\s*if \(\!bodyCartItems \|\| \!Array\.isArray\(bodyCartItems\) \|\| bodyCartItems\.length === 0\) \{/g;
code = code.replace(searchRegex1, "if (true) {\n      if (!bodyCartItems || !Array.isArray(bodyCartItems) || bodyCartItems.length === 0) {");

const searchStr2 = `    } else {
      const { data: dbCartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(\`
          quantity,
          unit,
          product_id,
          products (name, image, price, discount_price, category, size)
        \`)
        .eq('user_id', userId);

      if (cartError || !dbCartItems || dbCartItems.length === 0) {
        return res.status(400).json({ message: "Your cart is empty." });
      }
      cartItemsList = dbCartItems;
    }`;

code = code.split(searchStr2).join(`    }`);

fs.writeFileSync('c:/final_tilebazaar_backup/Tilebazaar_current/backend/src/controllers/paymentController.ts', code);
console.log('Done!');

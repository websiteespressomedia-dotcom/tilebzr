import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function run() {
  console.log("Querying delivery_zones...");
  const { data: zones, error: zonesErr } = await supabase.from('delivery_zones').select('*');
  if (zonesErr) {
    console.error("Error zones:", zonesErr);
  } else {
    console.log("Zones list:");
    console.log(JSON.stringify(zones, null, 2));
  }

  console.log("\nQuerying delivery_rates...");
  const { data: rates, error: ratesErr } = await supabase.from('delivery_rates').select('*');
  if (ratesErr) {
    console.error("Error rates:", ratesErr);
  } else {
    console.log("Rates count:", rates.length);
    console.log("Sample rates (first 5):");
    console.log(JSON.stringify(rates.slice(0, 5), null, 2));
  }
}

run();

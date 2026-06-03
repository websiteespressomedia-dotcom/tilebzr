require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateUUID = () => crypto.randomUUID();

const additionalZones = [
  {
    name: 'Scottish Highlands',
    postcodes: [
      'AB31', 'AB32', 'AB33', 'AB34', 'AB35', 'AB36', 'AB37', 'AB38', 'AB40', 'AB41', 'AB42', 'AB43', 'AB44', 'AB45', 'AB46', 'AB47', 'AB48', 'AB49', 'AB50', 'AB51', 'AB52', 'AB53', 'AB54', 'AB55', 'AB56', 'IV', 'KW', 'PA21', 'PA22', 'PA23', 'PA24', 'PA25', 'PA26', 'PA27', 'PA28', 'PA29', 'PA30', 'PA31', 'PA32', 'PA33', 'PA34', 'PA35', 'PA36', 'PA37', 'PA38', 'PA39', 'PA40', 'PH4', 'PH5', 'PH6', 'PH7', 'PH8', 'PH9', 'PH10', 'PH11', 'PH12', 'PH13', 'PH14', 'PH15', 'PH16', 'PH17', 'PH18', 'PH19', 'PH20', 'PH21', 'PH22', 'PH23', 'PH24', 'PH25', 'PH26', 'PH27', 'PH28', 'PH29', 'PH30', 'PH31', 'PH32', 'PH33', 'PH34', 'PH35', 'PH36', 'PH37', 'PH38', 'PH39', 'PH40', 'PH41', 'PH49', 'PH50'
    ],
    rates: { PARCEL: 25, QUARTER: 60, HALF: 80, 'FULL LIGHT': 100, FULL: 120 }
  },
  {
    name: 'Scottish Islands',
    postcodes: [
      'HS', 'IV41', 'IV42', 'IV43', 'IV44', 'IV45', 'IV46', 'IV47', 'IV48', 'IV49', 'IV51', 'IV55', 'IV56', 'KA27', 'KA28', 'KW15', 'KW16', 'KW17', 'PA20', 'PA41', 'PA42', 'PA43', 'PA44', 'PA45', 'PA46', 'PA47', 'PA48', 'PA49', 'PA60', 'PA61', 'PA62', 'PA63', 'PA64', 'PA65', 'PA66', 'PA67', 'PA68', 'PA69', 'PA70', 'PA71', 'PA72', 'PA73', 'PA74', 'PA75', 'PA76', 'PA77', 'PA78', 'PH42', 'PH43', 'PH44', 'ZE'
    ],
    rates: { PARCEL: 30, QUARTER: 80, HALF: 120, 'FULL LIGHT': 150, FULL: 180 }
  },
  {
    name: 'Northern Ireland',
    postcodes: ['BT'],
    rates: { PARCEL: 25, QUARTER: 75, HALF: 100, 'FULL LIGHT': 130, FULL: 150 }
  },
  {
    name: 'Isle of Man & Isles of Scilly',
    postcodes: ['IM', 'TR21', 'TR22', 'TR23', 'TR24', 'TR25'],
    rates: { PARCEL: 30, QUARTER: 90, HALF: 130, 'FULL LIGHT': 160, FULL: 190 }
  },
  {
    name: 'Isle of Wight',
    postcodes: ['PO30', 'PO31', 'PO32', 'PO33', 'PO34', 'PO35', 'PO36', 'PO37', 'PO38', 'PO39', 'PO40', 'PO41'],
    rates: { PARCEL: 25, QUARTER: 65, HALF: 90, 'FULL LIGHT': 120, FULL: 140 }
  },
  {
    name: 'Channel Islands',
    postcodes: ['JE', 'GY'],
    rates: { PARCEL: 30, QUARTER: 100, HALF: 150, 'FULL LIGHT': 180, FULL: 200 }
  }
];

async function insertZones() {
  for (const zone of additionalZones) {
    const zoneId = generateUUID();
    
    console.log(`Inserting zone ${zone.name}...`);
    const { error: zoneErr } = await supabase.from('delivery_zones').insert({
      id: zoneId,
      zone_name: zone.name,
      postcode_prefixes: zone.postcodes
    });

    if (zoneErr) {
      console.error(`Error inserting zone ${zone.name}:`, zoneErr);
      continue;
    }

    const ratesToInsert = Object.entries(zone.rates).map(([pallet_type, price]) => ({
      id: generateUUID(),
      zone_id: zoneId,
      pallet_type,
      price
    }));

    const { error: rateErr } = await supabase.from('delivery_rates').insert(ratesToInsert);
    if (rateErr) {
      console.error(`Error inserting rates for ${zone.name}:`, rateErr);
    } else {
      console.log(`Successfully added ${zone.name} and its rates.`);
    }
  }
  console.log("Done.");
}

insertZones();

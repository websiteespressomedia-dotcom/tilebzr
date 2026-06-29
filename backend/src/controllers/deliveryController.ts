import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export async function calculateShippingRateInternal(postcode: string, totalWeight: number): Promise<{ price: number; zone: string }> {
  const cleanPostcode = String(postcode).toUpperCase().replace(/[^A-Z0-9]/g, '');

  const prefixes = [];
  for (let i = 1; i <= cleanPostcode.length; i++) {
      prefixes.push(cleanPostcode.substring(0, i));
  }

  const { data: zones } = await supabase.from('delivery_zones').select('*');
  if (!zones || zones.length === 0) {
    throw new Error('Error fetching delivery zones');
  }

  let matchedZone = null;
  let maxMatchLen = 0;

  for (const zone of zones) {
    for (const prefix of zone.postcode_prefixes) {
      if (prefixes.includes(prefix) && prefix.length > maxMatchLen) {
          maxMatchLen = prefix.length;
          matchedZone = zone;
      }
    }
  }

  if (!matchedZone) {
     matchedZone = zones.find(z => z.zone_name === 'Mainland UK');
  }
  if (!matchedZone) {
     // Use the first zone as a safety fallback if Mainland UK is not defined
     matchedZone = zones[0];
  }

  const { data: rates } = await supabase
    .from('delivery_rates')
    .select('*')
    .eq('zone_id', matchedZone.id);

  if (!rates || rates.length === 0) {
    throw new Error('Error fetching rates for the matched zone');
  }

  // Calculate pallets (round up weight to the nearest 1000kg as full pallets)
  const totalPallets = Math.ceil(totalWeight / 1000);
  
  // Sum up prices based only on FULL pallet rates
  const fullRate = rates.find(r => r.pallet_type === 'FULL')?.price || 0;
  const totalLogistics = totalPallets * fullRate;

  return { price: Math.round(totalLogistics), zone: matchedZone.zone_name };
}

export const getDeliveryRate = async (req: Request, res: Response) => {
  try {
    const { postcode, weight } = req.query;
    if (!postcode || weight === undefined) return res.status(400).json({ message: 'Postcode and weight are required' });

    const totalWeight = Number(weight);
    const result = await calculateShippingRateInternal(String(postcode), totalWeight);

    res.json(result);
  } catch (error: any) {
    console.error('Error in getDeliveryRate:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

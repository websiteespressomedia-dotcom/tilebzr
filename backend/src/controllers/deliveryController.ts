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

  const getRate = (type: string, fallbackTypes: string[]): number => {
    const found = rates.find(r => r.pallet_type === type);
    if (found) return found.price;
    for (const f of fallbackTypes) {
      const fb = rates.find(r => r.pallet_type === f);
      if (fb) return fb.price;
    }
    return 0;
  };

  const fullRate = getRate('FULL', ['FULL LIGHT', 'HALF', 'QUARTER', 'PARCEL']);
  const fullLightRate = getRate('FULL LIGHT', ['FULL', 'HALF', 'QUARTER', 'PARCEL']);
  const halfRate = getRate('HALF', ['FULL LIGHT', 'FULL', 'QUARTER', 'PARCEL']);
  const quarterRate = getRate('QUARTER', ['HALF', 'FULL LIGHT', 'FULL', 'PARCEL']);
  const parcelRate = getRate('PARCEL', ['QUARTER', 'HALF', 'FULL LIGHT', 'FULL']);

  let totalPrice = 0;
  let remainingWeight = totalWeight;

  // Split out 1000kg increments as FULL pallets
  const fullPallets = Math.floor(remainingWeight / 1000);
  totalPrice += fullPallets * fullRate;
  remainingWeight = remainingWeight % 1000;

  // Match remainder weight to the smallest suitable tier
  if (remainingWeight > 0) {
    if (remainingWeight <= 30 && rates.some(r => r.pallet_type === 'PARCEL')) {
      totalPrice += parcelRate;
    } else if (remainingWeight <= 250) {
      totalPrice += quarterRate;
    } else if (remainingWeight <= 500) {
      totalPrice += halfRate;
    } else if (remainingWeight <= 750) {
      totalPrice += fullLightRate;
    } else {
      totalPrice += fullRate;
    }
  }

  return { price: Math.round(totalPrice), zone: matchedZone.zone_name };
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

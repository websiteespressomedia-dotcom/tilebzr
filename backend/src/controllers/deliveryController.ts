import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const getDeliveryRate = async (req: Request, res: Response) => {
  try {
    const { postcode, weight } = req.query;
    if (!postcode || weight === undefined) return res.status(400).json({ message: 'Postcode and weight are required' });

    const totalWeight = Number(weight);
    const cleanPostcode = String(postcode).toUpperCase().replace(/[^A-Z0-9]/g, '');

    const prefixes = [];
    for (let i = 1; i <= cleanPostcode.length; i++) {
        prefixes.push(cleanPostcode.substring(0, i));
    }

    const { data: zones } = await supabase.from('delivery_zones').select('*');
    if (!zones) return res.status(500).json({ message: 'Error fetching zones' });

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

    if (!matchedZone) return res.status(404).json({ message: 'No delivery zone found' });

    const { data: rates } = await supabase
      .from('delivery_rates')
      .select('*')
      .eq('zone_id', matchedZone.id);

    if (!rates) return res.status(500).json({ message: 'Error fetching rates' });

    // Calculate pallets
    const fullPallets = Math.floor(totalWeight / 1000);
    const remainderWeight = totalWeight % 1000;
    
    let partialType = '';
    if (remainderWeight > 0) {
      if (remainderWeight <= 30 && fullPallets === 0) partialType = 'PARCEL';
      else if (remainderWeight <= 250) partialType = 'QUARTER';
      else if (remainderWeight <= 500) partialType = 'HALF';
      else partialType = 'FULL';
    }

    // Sum up prices
    let totalLogistics = 0;
    const fullRate = rates.find(r => r.pallet_type === 'FULL')?.price || 0;
    
    if (fullPallets > 0) {
      totalLogistics += fullPallets * fullRate;
    }
    
    if (partialType) {
      // Find the specific partial rate, or fallback to FULL rate if not found
      const partialRate = rates.find(r => r.pallet_type === partialType)?.price || fullRate;
      totalLogistics += partialRate;
    }

    res.json({ price: totalLogistics, zone: matchedZone.zone_name });

  } catch (error) {
    console.error('Error in getDeliveryRate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

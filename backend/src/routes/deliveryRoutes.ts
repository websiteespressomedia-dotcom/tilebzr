import { Router } from 'express';
import { getDeliveryRate } from '../controllers/deliveryController.js';

const router = Router();

router.get('/rate', getDeliveryRate);

export default router;

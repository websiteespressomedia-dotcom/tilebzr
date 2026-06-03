import { Router } from 'express';
import { validateCoupon } from '../controllers/couponController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Secure all coupon routes
router.use(protect);

router.post('/validate', validateCoupon);

export default router;

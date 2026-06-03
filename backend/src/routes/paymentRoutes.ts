import { Router } from 'express';
import { createPaypalPayment, capturePaypalPayment, createStripePaymentIntent, captureStripePayment } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Secure all payment routes
router.use(protect);

router.post('/create-order', createPaypalPayment);
router.post('/capture-order', capturePaypalPayment);
router.post('/create-stripe-intent', createStripePaymentIntent);
router.post('/capture-stripe', captureStripePayment);

export default router;

import { Router } from 'express';
import { register, login, logout, forgotPassword, resetPassword, updateProfile, getProfile } from '../controllers/authController.js';
import { googleLogin, googleRegister } from '../controllers/googleAuthController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/google-register', googleRegister);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.patch('/profile/edit', protect, updateProfile);
router.get('/profile', protect, getProfile);

export default router;
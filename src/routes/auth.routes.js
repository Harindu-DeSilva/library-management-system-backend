const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken, authorizeRoles, firstLogin } = require('../middlewares/auth.middleware');

const router = express.Router();


router.post('/login', authController.login);
router.patch('/reset-password', verifyToken, authorizeRoles("superAdmin","admin", "user"), authController.resetPassword);
router.patch('/update-password', verifyToken, authorizeRoles("superAdmin","admin", "user"), authController.updatePassword);
router.get('/me', verifyToken, authorizeRoles("superAdmin", "admin", "user"), authController.authMe);
router.post('/logout',verifyToken,authController.logout);
router.post('/send-verification-code',authController.sendForgotPasswordCode);
router.post('/verify-verification-code',authController.verifyForgotPasswordCode);


module.exports = router;
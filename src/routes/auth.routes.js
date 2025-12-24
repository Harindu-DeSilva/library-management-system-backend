const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken, authorizeRoles, firstLogin } = require('../middlewares/auth.middleware');

const router = express.Router();


router.post('/login', authController.login);
router.patch('/reset-password', verifyToken, authorizeRoles("superAdmin","admin", "user"), authController.resetPassword);
router.post('/logout',verifyToken,authController.logout);


module.exports = router;
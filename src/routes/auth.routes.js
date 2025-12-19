const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout',verifyToken,authController.logout);


module.exports = router;
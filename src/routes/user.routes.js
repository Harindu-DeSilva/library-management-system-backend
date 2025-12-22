const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');


const router = express.Router();


router.post('/user', verifyToken, authorizeRoles("superAdmin", "admin"), userController.createUser);


module.exports = router;
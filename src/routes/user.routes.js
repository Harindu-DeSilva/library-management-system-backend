const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');


const router = express.Router();


router.post('/users', verifyToken, authorizeRoles("superAdmin", "admin"), userController.createUser);
router.get('/users', verifyToken, authorizeRoles("superAdmin", "admin"), userController.fetchAllUsers);


module.exports = router;
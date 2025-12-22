const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');


const router = express.Router();


router.post('/users', verifyToken, authorizeRoles("superAdmin", "admin"), userController.createUser);
router.get('/users', verifyToken, authorizeRoles("superAdmin", "admin"), userController.fetchAllUsers);
router.get('/users/:user_id', verifyToken, authorizeRoles("superAdmin", "admin", "user"), userController.fetchUserById);
router.patch('/users/:user_id', verifyToken, authorizeRoles("superAdmin", "admin", "user"), userController.updateUserById);


module.exports = router;
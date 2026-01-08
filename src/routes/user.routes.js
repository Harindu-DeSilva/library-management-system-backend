const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, authorizeRoles , firstLogin,} = require('../middlewares/auth.middleware');


const router = express.Router();


router.post('/users', verifyToken, authorizeRoles("superAdmin", "admin"), firstLogin, userController.createUser);
router.get('/users', verifyToken, authorizeRoles("superAdmin", "admin"), firstLogin, userController.fetchAllUsers);
router.get('/users/:user_id', verifyToken, authorizeRoles("superAdmin", "admin"), firstLogin, userController.fetchUserById);
router.patch('/users/:user_id', verifyToken, authorizeRoles("superAdmin", "admin"), firstLogin, userController.updateUserById);
router.delete('/users/:user_id', verifyToken, authorizeRoles("superAdmin","admin"), firstLogin, userController.deleteUserById);

module.exports = router;
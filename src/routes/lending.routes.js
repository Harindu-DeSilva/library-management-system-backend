const express = require('express');
const lendingController = require('../controllers/lending.controller');
const { verifyToken, authorizeRoles, firstLogin } = require('../middlewares/auth.middleware');
const router = express.Router();


router.post('/lending/:book_id', verifyToken, authorizeRoles("admin"), firstLogin,lendingController.LendBooksToUsers);


module.exports = router;
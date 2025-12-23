const express = require('express');
const categoryController = require('../controllers/category.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');


const router = express.Router();


router.post('/category', verifyToken, authorizeRoles("admin"), categoryController.createNewCategory);

module.exports = router;
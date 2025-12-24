const express = require('express');
const categoryController = require('../controllers/category.controller');
const { verifyToken, authorizeRoles, firstLogin, } = require('../middlewares/auth.middleware');


const router = express.Router();


router.post('/category', verifyToken, authorizeRoles("admin"),firstLogin, categoryController.createNewCategory);
router.get('/category/:lib_id_params', verifyToken, authorizeRoles("superAdmin", "admin", "user"),firstLogin, categoryController.fetchAllCategories);
router.patch('/category/:category_id', verifyToken, authorizeRoles("admin"),firstLogin, categoryController.updateCategory);
router.delete('/category/:category_id', verifyToken, authorizeRoles("admin"),firstLogin, categoryController.deleteCategory);

module.exports = router;
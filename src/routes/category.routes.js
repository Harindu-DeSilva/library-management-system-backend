const express = require('express');
const categoryController = require('../controllers/category.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');


const router = express.Router();


router.post('/category', verifyToken, authorizeRoles("admin"), categoryController.createNewCategory);
router.get('/category/:lib_id_params', verifyToken, authorizeRoles("superAdmin", "admin", "user"), categoryController.fetchAllCategories);
router.patch('/category/:category_id', verifyToken, authorizeRoles("admin"), categoryController.updateCategory);
router.delete('/category/:category_id', verifyToken, authorizeRoles("admin"), categoryController.deleteCategory);

module.exports = router;
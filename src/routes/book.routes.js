const express = require('express');
const bookController = require('../controllers/book.controller');
const upload = require('../middlewares/upload.middleware');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const router = express.Router();


router.post('/books', verifyToken , authorizeRoles("admin"), upload.single('image'), bookController.createBook);
router.get('/books', verifyToken, authorizeRoles("superAdmin", "admin", "user"), bookController.fetchAllBooks);
router.get('/books/:category_id', verifyToken, authorizeRoles("superAdmin", "admin", "user"), bookController.fetchAllBooksByCategoryID);

module.exports = router;

const express = require('express');
const bookController = require('../controllers/book.controller');
const upload = require('../middlewares/upload.middleware');
const { verifyToken, authorizeRoles, firstLogin } = require('../middlewares/auth.middleware');
const router = express.Router();


router.post('/books', verifyToken , authorizeRoles("admin"), firstLogin, upload.single('image'), bookController.createBook);
router.get('/books', verifyToken, authorizeRoles("superAdmin", "admin"),firstLogin, bookController.fetchAllBooks);
router.get('/books/:category_id', verifyToken, authorizeRoles("superAdmin", "admin"),firstLogin, bookController.fetchAllBooksByCategoryID);
router.get('/books/:book_id/book', verifyToken, authorizeRoles("superAdmin", "admin"),firstLogin, bookController.fetchBookByID);
router.patch('/books/:book_id', verifyToken, authorizeRoles("admin"), upload.single('image'),firstLogin, bookController.updateBookById);
router.delete('/books/:book_id', verifyToken, authorizeRoles("admin"),firstLogin, bookController.deleteBookById);

module.exports = router;

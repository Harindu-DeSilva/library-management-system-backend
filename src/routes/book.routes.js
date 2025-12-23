const express = require('express');
const bookController = require('../controllers/book.controller');
const upload = require('../middlewares/upload.middleware');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const router = express.Router();


router.post('/book', verifyToken , authorizeRoles("admin"), upload.single('image'), bookController.createBook);

module.exports = router;

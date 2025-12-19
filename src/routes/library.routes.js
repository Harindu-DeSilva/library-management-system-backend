const express = require('express');
const libraryController = require('../controllers/library.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');


const router = express.Router();


router.post('/library', verifyToken, authorizeRoles("superAdmin"), libraryController.newLibrary);


module.exports = router;
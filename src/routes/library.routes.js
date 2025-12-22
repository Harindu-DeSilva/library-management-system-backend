const express = require('express');
const libraryController = require('../controllers/library.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');


const router = express.Router();


router.post('/library', verifyToken, authorizeRoles("superAdmin"), libraryController.newLibrary);
router.get('/library', verifyToken, authorizeRoles("superAdmin"), libraryController.getAllLibraries);
router.get('/library/:lib_id_params', verifyToken, authorizeRoles("superAdmin", "admin", "user"), libraryController.getLibraryById);


module.exports = router;
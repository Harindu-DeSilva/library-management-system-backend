const express = require('express');
const libraryController = require('../controllers/library.controller');
const { verifyToken, authorizeRoles, firstLogin, } = require('../middlewares/auth.middleware');


const router = express.Router();


router.post('/library', verifyToken, authorizeRoles("superAdmin"), firstLogin, libraryController.newLibrary);
router.get('/library', verifyToken, authorizeRoles("superAdmin", "admin"), firstLogin, libraryController.getAllLibraries);
router.get('/library/:lib_id_params', verifyToken, authorizeRoles("superAdmin", "admin", "user"),firstLogin, libraryController.getLibraryById);
router.patch('/library/:lib_id_params', verifyToken, authorizeRoles("superAdmin", "admin"),firstLogin, libraryController.updateLibrary);
router.delete('/library/:lib_id_params', verifyToken, authorizeRoles("superAdmin"), firstLogin, libraryController.deleteLibraryById);

module.exports = router;
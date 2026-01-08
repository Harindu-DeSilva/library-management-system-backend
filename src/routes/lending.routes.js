const express = require('express');
const lendingController = require('../controllers/lending.controller');
const { verifyToken, authorizeRoles, firstLogin } = require('../middlewares/auth.middleware');
const router = express.Router();


router.post('/lending/:book_id', verifyToken, authorizeRoles("admin"), firstLogin,lendingController.LendBooksToUsers);
router.get('/lending', verifyToken, authorizeRoles("admin"), firstLogin, lendingController.fetchAllLendRecords);
router.patch('/update-lending/lending/:lend_id', verifyToken, authorizeRoles("admin"), firstLogin, lendingController.updateLendRecords);
router.get("/lending/export", verifyToken, authorizeRoles("admin"),firstLogin,lendingController.exportLendDataToExcel);

module.exports = router;
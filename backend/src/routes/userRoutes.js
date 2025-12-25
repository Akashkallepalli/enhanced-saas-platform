const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', authenticate, userController.getAllUsers);
router.get('/:userId', authenticate, userController.getUserById);
router.put('/:userId', authenticate, userController.updateUser);
router.delete('/:userId', authenticate, authorize(['tenant_admin', 'super_admin']), userController.deleteUser);

module.exports = router;

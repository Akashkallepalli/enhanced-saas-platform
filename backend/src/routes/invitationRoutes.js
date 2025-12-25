const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.post('/', authenticate, authorize(['tenant_admin', 'super_admin']), invitationController.sendInvitation);
router.get('/', authenticate, invitationController.getInvitations);
router.post('/:invitationId/accept', invitationController.acceptInvitation);

module.exports = router;

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', authenticate, projectController.getAllProjects);
router.post('/', authenticate, projectController.createProject);
router.get('/:projectId', authenticate, projectController.getProjectById);
router.put('/:projectId', authenticate, projectController.updateProject);
router.delete('/:projectId', authenticate, authorize(['tenant_admin', 'super_admin']), projectController.deleteProject);

module.exports = router;

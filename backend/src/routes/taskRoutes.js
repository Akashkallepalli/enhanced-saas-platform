const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, taskController.getAllTasks);
router.post('/', authenticate, taskController.createTask);
router.get('/:taskId', authenticate, taskController.getTaskById);
router.put('/:taskId', authenticate, taskController.updateTask);
router.delete('/:taskId', authenticate, taskController.deleteTask);

// Task Comments
router.post('/:taskId/comments', authenticate, taskController.addComment);
router.get('/:taskId/comments', authenticate, taskController.getComments);

module.exports = router;

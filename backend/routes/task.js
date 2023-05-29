const express = require('express');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getSubtasks,
  createSubtask,
  deleteSubtask,
  updateSubtask,
  createMessage,
  getMessages,
  getReplies,
  createReply,
} = require('../controllers/taskController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// require auth for all task routes
router.use(requireAuth);

// Create new task
router.post('/', createTask);

// GET ALL TASKS
router.get('/', getTasks);

// GET A SINGLE TASK BY ID
router.get('/:id', getTask);

// UPDATE A TASK BY ID
router.put('/:id', updateTask);

// DELETE A TASK BY ID
router.delete('/:id', deleteTask);

// GET ALL SUBTASKS OF A TASK
router.get('/:taskId/subtasks', getSubtasks);

// ADD A SUBTASK TO A TASK
router.post('/:taskId/subtasks', createSubtask);

// UPDATE A SUBTASK OF A TASK
router.put('/:taskId/subtasks/:subtaskId', updateSubtask);

// DELETE A SUBTASK OF A TASK
router.delete('/:taskId/subtasks/:subtaskId', deleteSubtask);

router.get('/:taskId/subtasks/:subtaskId/messages', getMessages);

router.post('/:taskId/subtasks/:subtaskId/messages', createMessage);

router.get('/:taskId/subtasks/:subtaskId/messages/:messageId/replies', getReplies);

router.post('/:taskId/subtasks/:subtaskId/messages/:messageId/replies', createReply);

module.exports = router;

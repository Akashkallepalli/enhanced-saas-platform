const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

exports.getAllTasks = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    
    let query = 'SELECT * FROM public.tasks WHERE tenant_id = $1';
    let params = [req.tenantId];

    if (projectId) {
      query += ' AND project_id = $' + (params.length + 1);
      params.push(projectId);
    }

    if (status) {
      query += ' AND status = $' + (params.length + 1);
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);

    res.json({
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { projectId, title, description, priority, assignedTo, dueDate } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ error: 'Project ID and title are required' });
    }

    const taskId = uuidv4();
    const result = await db.query(
      'INSERT INTO public.tasks (id, project_id, tenant_id, title, description, priority, assigned_to, created_by, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [taskId, projectId, req.tenantId, title, description, priority || 'medium', assignedTo, req.user.userId, dueDate]
    );

    res.status(201).json({
      message: 'Task created',
      data: result.rows
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await db.query(
      'SELECT * FROM public.tasks WHERE id = $1 AND tenant_id = $2',
      [taskId, req.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    const result = await db.query(
      'UPDATE public.tasks SET title = $1, description = $2, status = $3, priority = $4, assigned_to = $5, due_date = $6, updated_at = NOW() WHERE id = $7 AND tenant_id = $8 RETURNING *',
      [title, description, status, priority, assignedTo, dueDate, taskId, req.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task updated', data: result.rows });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await db.query(
      'DELETE FROM public.tasks WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [taskId, req.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const commentId = uuidv4();
    const result = await db.query(
      'INSERT INTO public.task_comments (id, task_id, tenant_id, user_id, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [commentId, taskId, req.tenantId, req.user.userId, comment]
    );

    res.status(201).json({
      message: 'Comment added',
      data: result.rows
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await db.query(
      'SELECT * FROM public.task_comments WHERE task_id = $1 AND tenant_id = $2 ORDER BY created_at DESC',
      [taskId, req.tenantId]
    );

    res.json({
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

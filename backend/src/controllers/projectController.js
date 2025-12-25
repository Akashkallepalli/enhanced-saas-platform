const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

exports.getAllProjects = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM public.projects WHERE tenant_id = $1 ORDER BY created_at DESC',
      [req.tenantId]
    );

    res.json({
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const projectId = uuidv4();
    const result = await db.query(
      'INSERT INTO public.projects (id, tenant_id, name, description, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [projectId, req.tenantId, name, description, req.user.userId]
    );

    res.status(201).json({
      message: 'Project created',
      data: result.rows
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await db.query(
      'SELECT * FROM public.projects WHERE id = $1 AND tenant_id = $2',
      [projectId, req.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, status } = req.body;

    const result = await db.query(
      'UPDATE public.projects SET name = $1, description = $2, status = $3, updated_at = NOW() WHERE id = $4 AND tenant_id = $5 RETURNING *',
      [name, description, status, projectId, req.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated', data: result.rows });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await db.query(
      'DELETE FROM public.projects WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [projectId, req.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

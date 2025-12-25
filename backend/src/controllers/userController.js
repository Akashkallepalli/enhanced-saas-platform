const db = require('../config/database');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, tenant_id, email, full_name, role, is_active FROM public.users WHERE tenant_id = $1',
      [req.tenantId]
    );

    res.json({
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      'SELECT id, tenant_id, email, full_name, role, is_active, created_at FROM public.users WHERE id = $1 AND tenant_id = $2',
      [userId, req.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email } = req.body;

    const result = await db.query(
      'UPDATE public.users SET full_name = $1, email = $2, updated_at = NOW() WHERE id = $3 AND tenant_id = $4 RETURNING *',
      [fullName, email, userId, req.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated', user: result.rows });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      'DELETE FROM public.users WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [userId, req.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

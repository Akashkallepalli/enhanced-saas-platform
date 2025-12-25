const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

exports.sendInvitation = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const invitationId = uuidv4();
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const result = await db.query(
      'INSERT INTO public.invitations (id, tenant_id, email, role, token, expires_at, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [invitationId, req.tenantId, email, role || 'member', token, expiresAt, req.user.userId]
    );

    res.status(201).json({
      message: 'Invitation sent',
      data: result.rows
    });
  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
};

exports.getInvitations = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM public.invitations WHERE tenant_id = $1 ORDER BY created_at DESC',
      [req.tenantId]
    );

    res.json({
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const invitation = await db.query(
      'SELECT * FROM public.invitations WHERE id = $1',
      [invitationId]
    );

    if (invitation.rows.length === 0) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const inv = invitation.rows;

    if (new Date() > inv.expires_at) {
      return res.status(410).json({ error: 'Invitation has expired' });
    }

    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));
    const userId = uuidv4();

    await db.query(
      'INSERT INTO public.users (id, tenant_id, email, full_name, password_hash, role, is_email_verified) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, inv.tenant_id, inv.email, inv.email, passwordHash, inv.role, true]
    );

    await db.query(
      'UPDATE public.invitations SET accepted_at = NOW() WHERE id = $1',
      [invitationId]
    );

    res.json({ message: 'Invitation accepted' });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
};

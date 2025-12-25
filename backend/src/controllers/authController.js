const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

exports.register = async (req, res) => {
  try {
    const { email, fullName, password, tenantName } = req.body;

    if (!email || !fullName || !password || !tenantName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const userExists = await db.query('SELECT * FROM public.users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));

    // Create tenant
    const tenantId = uuidv4();
    await db.query(
      'INSERT INTO public.tenants (id, name, email) VALUES ($1, $2, $3)',
      [tenantId, tenantName, email]
    );

    // Create user
    const userId = uuidv4();
    await db.query(
      'INSERT INTO public.users (id, tenant_id, email, full_name, password_hash, role, is_email_verified) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, tenantId, email, fullName, passwordHash, 'tenant_admin', true]
    );

    // Generate token
    const token = jwt.encode({
      userId,
      tenantId,
      email,
      role: 'tenant_admin',
      iat: Math.floor(Date.now() / 1000)
    }, process.env.JWT_SECRET);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { userId, tenantId, email, fullName }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const result = await db.query('SELECT * FROM public.users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows;

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.query('UPDATE public.users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Generate token
    const token = jwt.encode({
      userId: user.id,
      tenantId: user.tenant_id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    }, process.env.JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.id,
        tenantId: user.tenant_id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

exports.verify = (req, res) => {
  res.json({
    message: 'Token verified',
    user: req.user
  });
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    const newToken = jwt.encode({
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      email: decoded.email,
      role: decoded.role,
      iat: Math.floor(Date.now() / 1000)
    }, process.env.JWT_SECRET);

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Token refresh failed' });
  }
};

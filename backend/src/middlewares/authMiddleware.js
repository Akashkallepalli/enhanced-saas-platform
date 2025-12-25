const jwt = require('jwt-simple');

exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ');
    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    req.user = decoded;
    req.tenantId = decoded.tenantId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

exports.tenantCheck = (req, res, next) => {
  const tenantIdFromParam = req.params.tenantId || req.body.tenantId;
  
  if (tenantIdFromParam && tenantIdFromParam !== req.tenantId) {
    return res.status(403).json({ error: 'Tenant access denied' });
  }
  
  next();
};

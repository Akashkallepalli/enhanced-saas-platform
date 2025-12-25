const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes (we'll create these next)
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const invitationRoutes = require('./routes/invitationRoutes');

const app = express();

// ===================================
// MIDDLEWARE - SECURITY
// ===================================
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ===================================
// MIDDLEWARE - PARSING
// ===================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ===================================
// MIDDLEWARE - CORS
// ===================================
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===================================
// REQUEST LOGGING
// ===================================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method.toUpperCase()} ${req.path}`);
  next();
});

// ===================================
// ROUTES
// ===================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invitations', invitationRoutes);

// ===================================
// HEALTH CHECK ENDPOINT
// ===================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// ===================================
// 404 HANDLER
// ===================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    message: `${req.method} ${req.path} is not defined`
  });
});

// ===================================
// ERROR HANDLER
// ===================================
app.use((err, req, res, next) => {
  console.error('Error Stack:', err);
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString(),
    path: req.path,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===================================
// START SERVER
// ===================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║    ENHANCED SAAS BACKEND RUNNING       ║
╚════════════════════════════════════════╝

📍 Server: http://localhost:${PORT}
🔗 API: ${process.env.API_BASE_URL}
🌍 CORS Origin: ${process.env.CORS_ORIGIN}
🔒 Environment: ${process.env.NODE_ENV}
📅 Started: ${new Date().toISOString()}

✅ Ready to accept requests
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;

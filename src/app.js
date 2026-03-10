const express = require('express');
const cors = require('cors');
const path = require('path');

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const socialRouter = require('./routes/social');
const notificationsRouter = require('./routes/notifications');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use(usersRouter);
app.use(postsRouter);
app.use(socialRouter);
app.use(notificationsRouter);

// Catch-all: serve index.html for SPA routing
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;

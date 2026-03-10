const { Router } = require('express');
const { store } = require('../store');

const router = Router();

// Get notifications for a user
router.get('/api/notifications', (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const notifications = store.notifications.get(user_id) || [];
  const unread_count = notifications.filter(n => !n.read).length;

  res.json({ notifications, unread_count });
});

// Mark notification as read
router.put('/api/notifications/:id/read', (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const notifications = store.notifications.get(user_id) || [];
  const notif = notifications.find(n => n.id === req.params.id);
  if (!notif) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notif.read = true;
  res.json(notif);
});

// Mark all notifications as read
router.put('/api/notifications/read-all', (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const notifications = store.notifications.get(user_id) || [];
  notifications.forEach(n => { n.read = true; });

  res.json({ marked: notifications.length });
});

// Get unread count
router.get('/api/notifications/unread-count', (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const notifications = store.notifications.get(user_id) || [];
  const unread_count = notifications.filter(n => !n.read).length;

  res.json({ unread_count });
});

module.exports = router;

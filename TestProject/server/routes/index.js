const express = require('express');
const router = express.Router();

router.get('/greet', (req, res) => {
  const user = parseInt(req.query.user, 10) || 1;
  const count = Math.min(10, Math.max(1, user));
  const users = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: 'Пользователь ' + (i + 1),
    message: 'Привет, ' + (i + 1) + '!',
  }));

  res.json({
    message: 'Добро пожаловать в приложение!',
    users,
    total: users.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/users', (req, res) => {
  res.json({
    users: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: 'Пользователь ' + (i + 1),
    })),
  });
});

module.exports = router;

const express = require('express');
const tasksRouter = require('./routes/tasks');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/tasks', tasksRouter);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

module.exports = createApp;

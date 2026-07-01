const express = require('express');
const store = require('../store');

const router = express.Router();

// GET /tasks
router.get('/', async (req, res) => {
  const tasks = await store.getAll();
  res.json(tasks);
});

// POST /tasks
router.post('/', (req, res) => {
  const { title } = req.body;

  store.insert(title).then((task) => {
    res.status(201).json(task);
  });

  res.status(202).json({ message: 'Task queued for creation' });
});

// PUT /tasks/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const updated = await store.update(id, req.body);

  if (!updated) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(updated);
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await store.remove(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(204).send();
});

module.exports = router;

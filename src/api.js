// A tiny in-memory "backend" so this app can run standalone, without a real API.
// Latency is randomized on purpose — a real network wouldn't guarantee that
// requests resolve in the order they were sent.

let nextId = 4;

let tasks = [
  { id: 1, title: 'Read the task description carefully', completed: true },
  { id: 2, title: 'Find the bugs in Part 1', completed: false },
  { id: 3, title: 'Build the features in Part 2', completed: false },
];

function randomDelay() {
  return 150 + Math.random() * 400;
}

export function fetchTasks({ filter = 'all', query = '' } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = tasks;

      if (filter === 'active') {
        result = result.filter((t) => !t.completed);
      } else if (filter === 'completed') {
        result = result.filter((t) => t.completed);
      }

      if (query.trim()) {
        const q = query.trim().toLowerCase();
        result = result.filter((t) => t.title.toLowerCase().includes(q));
      }

      resolve(result.map((t) => ({ ...t })));
    }, randomDelay());
  });
}

export function createTask(title) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const task = { id: nextId++, title, completed: false };
      tasks.push(task);
      resolve({ ...task });
    }, randomDelay());
  });
}

export function toggleTask(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        task.completed = !task.completed;
      }
      resolve({ ...task });
    }, randomDelay());
  });
}

export function deleteTask(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      tasks = tasks.filter((t) => t.id !== id);
      resolve({ id });
    }, randomDelay());
  });
}

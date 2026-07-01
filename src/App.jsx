import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, toggleTask, deleteTask } from './api';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import FilterBar from './components/FilterBar.jsx';
import SearchBox from './components/SearchBox.jsx';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTasks({ filter, query }).then((result) => {
      setTasks(result);
      setLoading(false);
    });
  }, [filter, query]);

  async function handleAdd(title) {
    const task = await createTask(title);
    setTasks((prev) => [...prev, task]);
  }

  async function handleToggle(id) {
    const updated = await toggleTask(id);
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = updated.completed;
    }
    setTasks(tasks);
  }

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>

      <TaskForm onAdd={handleAdd} />
      <FilterBar filter={filter} onChange={setFilter} />
      <SearchBox onSearch={setQuery} />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default App;

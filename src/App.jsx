import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, toggleTask, deleteTask } from './api';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import FilterBar from './components/FilterBar.jsx';
import SearchBox from './components/SearchBox.jsx';
import { useUrlFilter } from './useUrlFilter.js';

function matchesFilter(task, filter) {
  if (filter === 'active') return !task.completed;
  if (filter === 'completed') return task.completed;
  return true;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useUrlFilter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState(() => new Set());
  const [toggleError, setToggleError] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setLoadError(null);

    fetchTasks({ filter, query })
      .then((result) => {
        if (isCurrent) {
          setTasks(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setLoadError("Couldn't load your tasks. Check your connection and try again.");
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [filter, query, reloadKey]);

  function handleRetry() {
    setReloadKey((key) => key + 1);
  }

  async function handleAdd(title) {
    const task = await createTask(title);
    setTasks((prev) => [...prev, task]);
  }

  async function handleToggle(id) {
    if (pendingIds.has(id)) return;

    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;

    const original = tasks[index];
    const optimistic = { ...original, completed: !original.completed };

    setToggleError(null);
    setPendingIds((prev) => new Set(prev).add(id));

    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? optimistic : t));
      return matchesFilter(optimistic, filter) ? next : next.filter((t) => t.id !== id);
    });

    try {
      await toggleTask(id);
    } catch {
      setTasks((prev) => {
        if (prev.some((t) => t.id === id)) {
          return prev.map((t) => (t.id === id ? original : t));
        }

        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, original);
        return next;
      });

      setToggleError(`Couldn't update "${original.title}". Please try again.`);
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
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

      {toggleError && (
        <p role="alert" className="toggle-error">
          {toggleError}
        </p>
      )}

      {loading && <p>Loading…</p>}

      {!loading && loadError && (
        <div className="load-error">
          <p>{loadError}</p>
          <button type="button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {!loading && !loadError && (
        <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default App;

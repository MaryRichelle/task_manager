import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../src/App.jsx';

vi.mock('../src/api', () => ({
  fetchTasks: vi.fn(),
  createTask: vi.fn(),
  toggleTask: vi.fn(),
  deleteTask: vi.fn(),
}));

import { deleteTask, fetchTasks, toggleTask } from '../src/api';

const seededTasks = [
  { id: 1, title: 'Read the task description carefully', completed: true },
  { id: 2, title: 'Find the bugs in Part 1', completed: false },
  { id: 3, title: 'Build the features in Part 2', completed: false },
];

function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

async function finishInitialLoad() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(400);
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('Task Manager', () => {
  it('renders the heading', () => {
    fetchTasks.mockResolvedValue([]);
    render(<App />);
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
  });

  it('shows the seeded tasks once loading finishes', async () => {
    vi.useFakeTimers();
    fetchTasks.mockResolvedValue(seededTasks);

    render(<App />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    await finishInitialLoad();

    for (const task of seededTasks) {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    }
  });

  it('re-renders a task as completed after its checkbox is toggled', async () => {
    vi.useFakeTimers();
    fetchTasks.mockResolvedValue(seededTasks);
    toggleTask.mockResolvedValue({ ...seededTasks[1], completed: true });

    render(<App />);
    await finishInitialLoad();

    const checkbox = screen.getByRole('checkbox', { name: seededTasks[1].title });
    fireEvent.click(checkbox);
    await act(async () => {});

    expect(checkbox).toBeChecked();
    expect(screen.getByText(seededTasks[1].title)).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('removes only the deleted task and leaves the remaining rows intact', async () => {
    vi.useFakeTimers();
    fetchTasks.mockResolvedValue(seededTasks);
    deleteTask.mockResolvedValue({ id: seededTasks[1].id });

    render(<App />);
    await finishInitialLoad();

    const row = screen.getByText(seededTasks[1].title).closest('li');
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1]);
    await act(async () => {});

    expect(row).not.toBeInTheDocument();
    expect(screen.queryByText(seededTasks[1].title)).not.toBeInTheDocument();
    expect(screen.getByText(seededTasks[0].title)).toBeInTheDocument();
    expect(screen.getByText(seededTasks[2].title)).toBeInTheDocument();
  });

  it('keeps the newest filter and search result when earlier requests resolve late', async () => {
    vi.useFakeTimers();
    const initial = deferred();
    const completed = deferred();
    const search = deferred();
    fetchTasks
      .mockReturnValueOnce(initial.promise)
      .mockReturnValueOnce(completed.promise)
      .mockReturnValueOnce(search.promise);

    render(<App />);
    await finishInitialLoad();

    fireEvent.click(screen.getByRole('button', { name: 'completed' }));
    await finishInitialLoad();

    await act(async () => {
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'latest' } });
      await vi.advanceTimersByTimeAsync(700);
    });

    await act(async () => {
      search.resolve([{ id: 4, title: 'Latest result', completed: false }]);
    });
    expect(screen.getByText('Latest result')).toBeInTheDocument();

    await act(async () => {
      completed.resolve([{ id: 5, title: 'Stale completed result', completed: true }]);
      initial.resolve([{ id: 6, title: 'Stale initial result', completed: false }]);
    });

    expect(screen.getByText('Latest result')).toBeInTheDocument();
    expect(screen.queryByText('Stale completed result')).not.toBeInTheDocument();
    expect(screen.queryByText('Stale initial result')).not.toBeInTheDocument();
  });
});

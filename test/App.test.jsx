import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';

describe('Task Manager', () => {
  it('renders the heading', () => {
    render(<App />);
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
  });

  // TODO (candidate): add tests covering:
  // - the task list eventually shows the seeded tasks after loading
  // - toggling a task's checkbox actually re-renders it as completed
  // - deleting a task removes it from the list, keyed correctly (not by stray index bugs)
  // - rapidly switching filters/search doesn't leave the UI showing stale/out-of-order results
  // - any Part 2 features you implement (URL-synced filter, optimistic toggle, proper debounce, retry-on-error)
});

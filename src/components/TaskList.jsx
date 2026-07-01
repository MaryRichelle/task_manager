import React from 'react';
import TaskItem from './TaskItem.jsx';

function TaskList({ tasks, onToggle, onDelete }) {
  if (!tasks.length) {
    return <p>No tasks found.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <TaskItem key={index} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default TaskList;

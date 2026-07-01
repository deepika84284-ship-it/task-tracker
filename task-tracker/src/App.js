import React, { useState, useEffect } from 'react';
import './App.css';

const API = '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) {
        throw new Error('Unable to load tasks');
      }
      const data = await res.json();
      setTasks(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load tasks');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required!');
      return;
    }
    setError('');

    try {
      if (editId) {
        await fetch(`${API}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description })
        });
        setEditId(null);
      } else {
        await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description })
        });
      }
      setTitle('');
      setDescription('');
      await fetchTasks();
    } catch (err) {
      setError('Unable to save task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      await fetchTasks();
    } catch (err) {
      setError('Unable to delete task');
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  const handleComplete = async (task) => {
    try {
      await fetch(`${API}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      await fetchTasks();
    } catch (err) {
      setError('Unable to update task');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Task Tracker</h1>
      </header>

      <div className="form">
        <input
          type="text"
          placeholder="Task title *"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button onClick={handleSubmit}>
          {editId ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      <div className="tasks">
        {tasks.length === 0 && <p className="empty">No tasks yet. Add one!</p>}
        {tasks.map(task => (
          <div key={task._id} className={`task-card ${task.completed ? 'done' : ''}`}>
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <div className="task-actions">
              <button onClick={() => handleComplete(task)}>
                {task.completed ? '↩ Undo' : '✓ Done'}
              </button>
              <button onClick={() => handleEdit(task)}>✏ Edit</button>
              <button onClick={() => handleDelete(task._id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
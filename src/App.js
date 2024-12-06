import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Analytics from './Analytics';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/tasks');
      const tasks = response.data;
      console.log('API response (App):', tasks);

      if (Array.isArray(tasks)) {
        setTasks(tasks);
      } else {
        console.error('Expected tasks to be an array, but got:', typeof tasks, tasks);
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
    setLoading(false);
  };

  const addTask = async (title, quadrant) => {
    try {
      console.log(`Adding task: ${title} to quadrant: ${quadrant}`);
      await axios.post('/tasks', { title, quadrant });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id, completed) => {
    try {
      console.log(`Updating task ID: ${id} to completed: ${completed}`);
      await axios.put(`/tasks/${id}`, { completed });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const quadrantStyles = {
    'DO': 'glass border-red-500 text-red-500 glow-red',
    'SCHEDULE(PLAN ABOUT IT)': 'glass border-green-500 text-green-500 glow-green',
    'DELEGATE(THINK ABOUT IT)': 'glass border-yellow-500 text-yellow-500 glow-yellow',
    'ELIMINATE(GET RID OF IT)': 'glass border-blue-500 text-blue-500 glow-blue',
  };

  const headingStyles = {
    'DO': 'bg-red-500 text-white p-2 mb-1 rounded-left',
    'SCHEDULE(PLAN ABOUT IT)': 'bg-green-500 text-white p-2 mb-1 rounded-left',
    'DELEGATE(THINK ABOUT IT)': 'bg-yellow-500 text-white p-2 mb-1 rounded-left',
    'ELIMINATE(GET RID OF IT)': 'bg-blue-500 text-white p-2 mb-1 rounded-left',
  };

  return (
    <div className="app-container min-h-screen p-6">
      <div className="flex flex-col items-center">
        <div className="text-wrapper">
          <h1 className="text-4xl font-bold text-black-600 eisenhower-matrix-heading">Eisenhower Matrix</h1>
        </div>
      </div>
      <div className="flex justify-center mb-8">
        <Analytics />
      </div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-4">
          {['DO', 'SCHEDULE(PLAN ABOUT IT)', 'DELEGATE(THINK ABOUT IT)', 'ELIMINATE(GET RID OF IT)'].map((quadrant) => (
            <div key={quadrant} className={`rounded-lg p-6 shadow-lg border-4 ${quadrantStyles[quadrant]}`}>
              <div className="flex justify-left mb-4">
                <h2 className={`text-2xl font-bold mb-0.5 rounded ${headingStyles[quadrant]}`}>{quadrant}</h2>
              </div>
              <div className={`border-b-4 mb-4 ${quadrantStyles[quadrant]}`}></div>
              <ul>
                {tasks.filter(task => {
                  const isCorrectQuadrant = task.quadrant === quadrant;
                  console.log(`Task ID ${task.id} in quadrant ${task.quadrant}:`, isCorrectQuadrant);
                  return isCorrectQuadrant;
                }).map(task => (
                  <li key={task.id} className="flex items-center mb-2 text-gray-900">
                    <input type="checkbox" checked={task.completed} onChange={() => updateTask(task.id, !task.completed)} className="mr-2"/>
                    <span className={`task-title ${task.completed ? 'task-completed' : ''}`}>{task.title}</span>
                  </li>
                ))}
              </ul>
              <input type="text" placeholder="New Task" onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  console.log(`Adding task to quadrant: ${quadrant}`);
                  addTask(e.target.value, quadrant);
                  e.target.value = '';
                }
              }} className="mt-4 p-2 border rounded-full w-full transition-all duration-300 focus:rounded focus:outline-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

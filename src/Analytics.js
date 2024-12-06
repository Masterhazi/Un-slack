import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

function Analytics() {
  const [taskData, setTaskData] = useState({ completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskData();
  }, []);

  const fetchTaskData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/tasks');
      const tasks = response.data;
      console.log('API response (Analytics):', tasks);

      if (Array.isArray(tasks)) {
        const completed = tasks.filter(task => task.completed).length;
        const pending = tasks.length - completed;
        setTaskData({ completed, pending });
      } else {
        console.error('Expected tasks to be an array, but got:', typeof tasks, tasks);
        setTaskData({ completed: 0, pending: 0 });
      }
    } catch (error) {
      console.error('Error fetching task data:', error);
      setTaskData({ completed: 0, pending: 0 });
    }
    setLoading(false);
  };

  return (
    <div className="analytics-container glass border-4 p-6 rounded-lg shadow-lg mb-8 dark-mode">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <Plot
          data={[
            {
              values: [taskData.completed, taskData.pending],
              labels: ['Completed', 'Pending'],
              type: 'pie',
              hole: .4,
              marker: {
                colors: ['#4CAF50', '#FF9800'],
              },
            },
          ]}
          layout={{
            title: '',
            showlegend: true,
            paper_bgcolor: '#1e1e1e',
            plot_bgcolor: '#1e1e1e',
            font: {
              color: '#ffffff',
            },
            margin: { t: 0, b: 0, l: 0, r: 0 },
          }}
          config={{ responsive: true }}
        />
      )}
    </div>
  );
}

export default Analytics;

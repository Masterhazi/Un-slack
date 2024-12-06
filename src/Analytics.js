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

      if (Array.isArray(tasks)) {
        const completed = tasks.filter(task => task.completed).length;
        const pending = tasks.length - completed;
        setTaskData({ completed, pending });
      } else {
        console.error('Invalid response format:', tasks);
      }
    } catch (error) {
      console.error('Error fetching task data:', error);
    }
    setLoading(false);
  };

  return (
    <div className="analytics-container">
      <h2 className="text-2xl font-bold mb-4">Task Analytics</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <Plot
          data={[
            {
              values: [taskData.completed, taskData.pending],
              labels: ['Completed', 'Pending'],
              type: 'pie',
              hole: 0.4, // Doughnut chart
              marker: { colors: ['#4CAF50', '#FF9800'] },
            },
          ]}
          layout={{
            height: 400, // Adjusted graph height
            width: 500, // Adjusted graph width
            showlegend: true,
            paper_bgcolor: 'rgba(30,30,30,0.9)',
            plot_bgcolor: 'rgba(30,30,30,0.9)',
            font: { color: '#ffffff' },
            margin: { t: 10, b: 10, l: 10, r: 10 },
          }}
          config={{ responsive: true }}
        />
      )}
    </div>
  );
}

export default Analytics;

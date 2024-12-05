import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

function Analytics() {
  const [taskData, setTaskData] = useState({ completed: 0, pending: 0 });

  useEffect(() => {
    fetchTaskData();
  }, []);

  const fetchTaskData = async () => {
    const response = await axios.get('/tasks');
    const tasks = response.data;
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;
    setTaskData({ completed, pending });
  };

  return (
    <div className="analytics-container glass border-4 p-6 rounded-lg shadow-lg mb-8 dark-mode">
      <div className="analytics-heading">
        <div className="text-wrapper">
          <h2 className="text-2xl font-bold text-blue-900">Task Analytics</h2>
        </div>
      </div>
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
            color: '#ffffff'
          },
          margin: { t: 0, b: 0, l: 0, r: 0 },
        }}
        config={{ responsive: true }}
      />
    </div>
  );
}

export default Analytics;

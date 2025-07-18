import React from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
      hoverOffset: 4,
    },
  ],
};

const BarChart = () => {
  return (
    <div>
      <h2>Bar Chart Example</h2>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;

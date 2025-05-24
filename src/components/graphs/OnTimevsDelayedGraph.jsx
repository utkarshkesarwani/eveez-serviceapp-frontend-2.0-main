import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
const OnTimevsDelayedGraph = ({ data }) => {
  const [graphData, setGraphData] = useState();
  useEffect(() => {
    if (data) {
      setGraphData({
        labels: ["On Time", "Delayed"],
        datasets: [
          {
            data: [data[1].onTimeTasks, data[1].delayedTasks],
            backgroundColor: ["#00E096", "#FFA800"],
            borderRadius: 5,
            barThickness: 90,
          },
        ],
      });
    }
  }, [data]);
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: {
        top: 30,
        left: 20,
        right: 20,
        bottom: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((acc, val) => acc + val, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(2); // Calculate percentage
            return ` ${percentage}%`; // Display label with percentage
          },
        },
      },
      datalabels: {
        display: true,
      },
    },
  };

  return (
    <div className="h-[300px]">
      {graphData && <Pie data={graphData} options={options} />}
    </div>
  );
};

export default OnTimevsDelayedGraph;

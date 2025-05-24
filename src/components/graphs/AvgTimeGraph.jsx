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
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
const AverageTimeGraph = ({ data }) => {
  const [graphData, setGraphData] = useState();
  useEffect(() => {
    if (data) {
      setGraphData({
        labels: [data[0].name.split(" ")[0], "Other Technicians"],
        datasets: [
          {
            data: [data[0].averageTime, data[1]],
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
        top: 10,
        left: 20,
        right: 20,
        bottom: 0,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#000000",
          font: {
            size: 11,
            weight: 600,
          },
        },
      },
      y: {
        ticks: {
          stepSize: 0.5,
        },
        grid: {
          display: false,
          drawBorder: false,
          color: "#E6E6E6",
        },
        title: {
          display: false,
          text: "time (in hr)",
          font: {
            weight: "600",
            size: 14,
          },
          padding: 10,
          color: "#363939",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "right",
      },
      datalabels: {
        display: true,
      },
    },
  };
  return (
    <div className="h-[300px]">
      {graphData && <Bar data={graphData} options={options} />}
    </div>
  );
};

export default AverageTimeGraph;

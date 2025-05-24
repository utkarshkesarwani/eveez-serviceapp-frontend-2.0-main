import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
const CustomerRatingGraph = ({ data }) => {
  const [graphData, setGraphData] = useState();
  useEffect(() => {
    if (data) {
      setGraphData({
        labels: data[0],
        datasets: [
          {
            data: data[1],
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
        left: 0,
        right: 30,
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
        title: {
          display: true,
          text: "Customers",
          font: {
            weight: "400",
            size: 16,
          },
          padding: 10,
          color: "#363939",
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Customer rating",
          font: {
            weight: "400",
            size: 16,
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
    <div className="h-[350px]">
      {graphData && <Line data={graphData} options={options} />}
    </div>
  );
};

export default CustomerRatingGraph;

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

const BookedVsDonePie = ({ data }) => {
  const [graphData, setGraphData] = useState();
  useEffect(() => {
    if (data) {
      setGraphData({
        labels: ["Total Booked", "Total Done"],
        datasets: [
          {
            data: [data[0], data[1]],
            backgroundColor: ["#FF5733", "#44D679"],
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
        top: 50,
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
          stepSize: Math.max(3, Math.ceil(data[0] / 3)),
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
        font: {
          weight: 600,
          size: 15,
        },
        color: "#ffff",
      },
    },
  };
  return (
    <div className="h-[350px]">
      {graphData && <Bar data={graphData} options={options} />}
    </div>
  );
};

export default BookedVsDonePie;

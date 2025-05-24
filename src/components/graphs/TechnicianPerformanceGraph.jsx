import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  PointElement,
  LineElement
);
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
const TechnicianPerformanceGraph = ({ data }) => {
  const [graphData, setGraphData] = useState();
  useEffect(() => {
    if (data) {
      setGraphData({
        labels: data.map((technician) => technician.technician),
        datasets: [
          {
            data: data.map((technician) => technician.total_tickets),
          },
        ],
      });
    }
  }, [data]);
  const maxTickets = Math.max(
    8,
    ...data.map((technician) => technician.total_tickets)
  );

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    indexAxis: "y",
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
          stepSize: 2,
          font: {
            size: 11,
            weight: 600,
          },
        },
        title: {
          display: true,
          text: "Service Requests Closed",
          font: {
            weight: "400",
            size: 16,
          },
          padding: 10,
          color: "#363939",
        },
        max: maxTickets,
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        title: {
          display: false,
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
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: true,
        color: "black",
        align: "end",
        anchor: "end",
        font: {
          size: 12,
        },
        padding: {
          left: 6,
        },
      },
    },
  };

  return (
    <div className="h-[390px]">
      {graphData && <Bar data={graphData} options={options} />}
    </div>
  );
};

export default TechnicianPerformanceGraph;

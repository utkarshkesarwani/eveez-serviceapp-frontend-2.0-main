import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ServiceRequestOverviewGraph = ({ data }) => {
  if (data === undefined) return null;

  const [graphData, setGraphData] = useState();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const totalCount = data["to_do"] + data["in_progress"] + data["done"];
    setTotal(totalCount);

    setGraphData({
      labels: ["To Do", "In Progress", "Done"],
      datasets: [
        {
          label: "Service Requests",
          data: [data["to_do"], data["in_progress"], data["done"]],
          backgroundColor: ["#FF703B", "#39CEF3", "#9AD960"],
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "#F7F7F7",
        },
      ],
    });
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        display: false,
        position: "left",
        labels: {
          usePointStyle: true,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      datalabels: {
        color: "#fff",
        display: true,
        formatter: (value) => value,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((acc, curr) => acc + curr, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return ` ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row">
      <div className="w-full sm:w-[60%] flex justify-start h-[315px] relative">
        {graphData && (
          <>
            <Doughnut
              data={graphData}
              options={options}
              plugins={[ChartDataLabels]}
              padding={50}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-semibold">{total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="w-full sm:w-[40%] flex justify-center items-center">
        {graphData && (
          <ul>
            {graphData.labels.map((label, index) => (
              <li key={index} className="flex items-center mb-2">
                <span
                  className="inline-block w-4 h-4 mr-2"
                  style={{
                    backgroundColor:
                      graphData.datasets[0].backgroundColor[index],
                  }}
                ></span>
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestOverviewGraph;

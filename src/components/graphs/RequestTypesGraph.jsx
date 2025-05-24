import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const RequestTypesGraph = ({ data }) => {
  if (data == undefined) return null;

  const [inputData, setInputData] = useState({
    label: [],
    data: [],
  });
  const [graphData, setGraphData] = useState();

  useEffect(() => {
    if (data) {
      let result = {
        label: [],
        data: [],
      };
      data?.forEach((ele, i) => {
        if (ele.count !== 0) {
          result.label.push(ele.name);
          result.data.push(ele.count);
        }
      });
      setInputData(result);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setGraphData({
        labels: inputData.label,
        datasets: [
          {
            label: "count",
            data: inputData.data,
            backgroundColor: [
              "#FF703B",
              "#9AD960",
              "#39CEF3",
              "#cba7fc",
              "#00E096",
              "#FFA600",
              "#FF6361",
              "#58508D",
              "#BC5090",
              "#003F5C",
            ],
            borderRadius: 10,
            offset: 20,
            borderWidth: 2,
            borderColor: "#F7F7F7",
          },
        ],
      });
    }
  }, [inputData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 10,
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
          size: 11,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((acc, curr) => acc + curr, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(2);
            if (currentValue < 25) {
              return ` ${currentValue} - ${percentage}%`;
            } else {
              return ` ${percentage}%`;
            }
          },
        },
      },
    },
  };

  return (
    <div className="flex">
      <div className="w-[40%] flex justify-center items-center">
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
      <div className="w-[60%] flex justify-start h-[430px]">
        {graphData && (
          <Doughnut
            data={graphData}
            options={options}
            plugins={[ChartDataLabels]} // Removed the custom line plugin
            padding={50}
          />
        )}
      </div>
    </div>
  );
};

export default RequestTypesGraph;

import { Select } from "antd";
import React, { useEffect, useState } from "react";
import AvgTimeGraph from "../graphs/AvgTimeGraph";
import toast from "react-hot-toast";
import { GetAvgTaskCompletionData } from "../../service/efficiency.service";
import Loader from "../Loader";
import { useAuth } from "../../hooks/AuthProvider";

const AvgTimeTaken = () => {
  const [AvgTimeData, setAvgTimeData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Technician, setTechnician] = useState(null);
  const [TechnicianList, setTechnicianList] = useState([]);
  const { userLocation } = useAuth();

  const FetchAverageTimeData = async () => {
    setIsLoading(true);
    try {
      const data = await GetAvgTaskCompletionData(userLocation);
      setAvgTimeData(data);
      setTechnician(data[0].name);
    } catch (err) {
      toast.error("Unknown Error Occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchAverageTimeData();
  }, [userLocation]);

  useEffect(() => {
    if (AvgTimeData.length > 0) {
      let totalTime = 0;
      let numberOfTechnician = 0;
      let techniciansAverage;
      let resultTechData;
      let ListArr = [];
      AvgTimeData.forEach((data, index) => {
        totalTime += data.averageTime;
        numberOfTechnician++;
        ListArr.push({ value: `${data.name}-${index}`, label: data.name });
      });
      setTechnicianList(ListArr);

      techniciansAverage = (totalTime / numberOfTechnician).toFixed(2) - 0;

      if (Technician) {
        resultTechData = AvgTimeData.find(
          (ele) => ele.name === Technician.split("-")[0]
        );
      } else {
        resultTechData = AvgTimeData[0];
      }

      setGraphData([resultTechData, techniciansAverage]);
    }
  }, [Technician, AvgTimeData]);

  return (
    <section className="flex flex-col justify-between gap-2 h-full">
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <h1 className="text-base md:text-lg font-[500]">
          Avg Task Completion Time (hrs)
        </h1>
        <div className="flex items-center px-2 py-0 rounded-lg w-max">
          <Select
            value={Technician}
            placeholder="Select Technician"
            style={{ width: 180 }}
            loading={isLoading}
            size="middle"
            onChange={(value) => setTechnician(value)}
            options={TechnicianList}
          />
        </div>
      </header>
      <main className="h-[300px]">
        {graphData && <AvgTimeGraph data={graphData} />}
        {AvgTimeData.length === 0 && (
          <Loader
            isLoading={isLoading}
            Title="No Data Found"
            height={300}
            width={300}
          />
        )}
      </main>
    </section>
  );
};

export default AvgTimeTaken;

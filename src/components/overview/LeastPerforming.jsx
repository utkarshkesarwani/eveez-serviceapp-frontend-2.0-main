import React, { useEffect, useState } from "react";
import TechnicianPerformanceGraph from "../graphs/TechnicianPerformanceGraph";
import { Select } from "antd";
import toast from "react-hot-toast";
import { GetTechnicianPerformceData } from "../../service/efficiency.service";
import { useAuth } from "../../hooks/AuthProvider";
import Loader from "../Loader";
const LeastPerforming = () => {
  const { userLocation } = useAuth();
  const [performanceData, setPerformaceData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [Filter, setFilter] = useState("least");
  const [isLoading, setIsLoading] = useState(false);
  const FetchPerformanceData = async () => {
    setIsLoading(true);
    try {
      const data = await GetTechnicianPerformceData(userLocation);
      setPerformaceData(data);
    } catch (err) {
      toast.error("Unknown Error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    FetchPerformanceData();
  }, [userLocation]);
  return (
    <section className="flex flex-col gap-3 bg-white p-3 rounded-lg overflow-x-auto">
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <h1 className="text-base sm:text-xl  md:text-2xl  font-[600]">
          Technician Performance (7 Days)
        </h1>
        <div className="flex items-center gap-3  px-2 py-0 rounded-lg w-max">
          <Select
            defaultValue={"least"}
            value={Filter}
            style={{ width: 170 }}
            onChange={(value) => {
              setFilter(value);
            }}
            options={[
              { value: "least", label: "Least Performing" },
              { value: "top", label: "Top Performing" },
            ]}
          />
        </div>
      </header>
      <section>
        {performanceData.length > 0 && (
          <TechnicianPerformanceGraph
            data={
              Filter === "least"
                ? performanceData.slice(0, 10)
                : performanceData.slice(-10).reverse()
            }
          />
        )}
        {performanceData.length === 0 && (
          <Loader
            isLoading={isLoading}
            Title={"No Data Found"}
            height={300}
            width={300}
          />
        )}
      </section>
    </section>
  );
};

export default LeastPerforming;

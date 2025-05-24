import { Select } from "antd";
import React, { useEffect, useState } from "react";
import OnTimevsDelayedGraph from "../graphs/OnTimevsDelayedGraph";
import toast from "react-hot-toast";
import { GetOnTimevsDelayedData } from "../../service/technician.service";
import Loader from "../Loader";
import { useAuth } from "../../hooks/AuthProvider";

const OnTimevsDelayed = () => {
  const [OnTimevsDelayedData, setOnTimevsDelayedData] = useState([]);
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [Technician, setTechnician] = useState();
  const [timeSpan, setTimeSpan] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const { userLocation } = useAuth();
  const FetchOnTimeandDelayedData = async () => {
    setIsLoading(true);
    try {
      const data = await GetOnTimevsDelayedData(userLocation);
      const Data = {};
      let Technicianlist = [];
      data.forEach((tech) => {
        Data[tech.technician] = tech.data;
        Technicianlist.push(tech.technician);
      });
      setOnTimevsDelayedData(Data);
      setAllTechnicians(Technicianlist);
      setTechnician(Technicianlist[0]);
    } catch (err) {
      toast.error("Unknown Error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    FetchOnTimeandDelayedData();
  }, [userLocation]);
  return (
    <section className="flex flex-col gap-3">
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <h1 className="text-base  md:text-lg  font-[500]">
          On Time vs Delayed Tasks
        </h1>
        <div className="flex flex-col items-center gap-3 px-2 py-0 rounded-lg w-max">
          <Select
            value={Technician}
            placeholder={"Select Technician"}
            style={{ width: 180 }}
            loading={isLoading}
            size="middle"
            onChange={(value) => setTechnician(value)}
            options={[
              ...allTechnicians.map((technician) => ({
                value: technician,
                label: technician,
              })),
            ]}
          />
        </div>
      </header>
      <section className="flex justify-start sm:justify-end px-5">
        <Select
          defaultValue="monthly"
          style={{ width: 120 }}
          onChange={(value) => setTimeSpan(value)}
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "weekly", label: "Weekly" },
          ]}
        />
      </section>
      <main className="h-[300px]">
        {Technician && OnTimevsDelayedData && (
          <OnTimevsDelayedGraph
            data={[Technician, OnTimevsDelayedData[Technician][timeSpan]]}
          />
        )}
        {OnTimevsDelayedData.length === 0 && (
          <Loader
            isLoading={isLoading}
            Title={"No Data Found"}
            height={300}
            width={300}
          />
        )}
      </main>
    </section>
  );
};

export default OnTimevsDelayed;

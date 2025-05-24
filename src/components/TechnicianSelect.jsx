import React, { useEffect, useState } from "react";
import { GetTechnicianStats } from "../service/technician.service";
import { Select } from "antd";
import toast from "react-hot-toast";

const TechnicianSelect = ({
  onChange,
  withWorkLoad,
  width,
  size = "middle",
  additionalOptions,
  defaultValue,
  location,
}) => {
  const [TechnicianStats, setTechnicianStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //Fetch Technician Stats
  const FetchTechnicianStats = async () => {
    setIsLoading(true);
    try {
      const stats = await GetTechnicianStats({ location });
      setTechnicianStats(stats);
    } catch (err) {
      toast.error("Unknown Error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    FetchTechnicianStats();
  }, [location]);
  return (
    <>
      <Select
        defaultValue={defaultValue || null}
        placeholder={"Select Technician"}
        style={{ width: width }}
        loading={isLoading}
        size={size}
        onChange={(key) => {
          const selectedTechnician = TechnicianStats.find(
            (ele) => ele.key === key
          );
          onChange({ key, name: selectedTechnician?.name || "" });
        }}
        options={[
          ...(additionalOptions || []),
          ...TechnicianStats.map((technician) => ({
            key: technician.key,
            value: technician.key,
            label: GenerateLabel(withWorkLoad, technician),
          })),
        ]}
      />
    </>
  );
};

//To Generate Labels with and Without WorkLoads
const GenerateLabel = (withWorkLoad, technician) => {
  if (!withWorkLoad) {
    return <p className="text-base">{technician.name}</p>;
  }
  return (
    <div className="flex justify-between text-base pr-3">
      {technician.name}
      <div
        className={
          technician.incomplete > 5 ? "text-red-600" : "text-green-500"
        }
      >
        Work Load : {technician.incomplete}
      </div>
    </div>
  );
};
export default TechnicianSelect;

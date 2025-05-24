import React, { useEffect, useState } from "react";
import { Select } from "antd";
import toast from "react-hot-toast";
import { GetRequestTypeStats } from "../../service/quality-analytics.service";
import RequestTypesGraph from "../graphs/RequestTypesGraph";
import { useAuth } from "../../hooks/AuthProvider";
import Loader from "../Loader";

const RequestTypeStats = () => {
  const [Stats, setStats] = useState([]);
  const [timeSpan, setTimeSpan] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const { userLocation } = useAuth();
  const FetchRequestTypeStats = async () => {
    setIsLoading(true);
    try {
      const stats = await GetRequestTypeStats(timeSpan, userLocation);
      setStats(stats);
    } catch (err) {
      toast.error("Unknown error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    FetchRequestTypeStats();
  }, [timeSpan, userLocation]);
  return (
    <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg  overflow-auto">
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <span className="flex items-center gap-3 text-lg sm:text-xl font-semibold">
          Types of Service Requests
        </span>
        <div className="flex items-center px-2 py-0 rounded-lg w-max">
          {/*Time Span Filter */}
          <Select
            defaultValue={timeSpan}
            style={{ width: 130 }}
            onChange={(value) => setTimeSpan(value)}
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "weekly", label: "Weekly" },
            ]}
          />
        </div>
      </header>
      <section>
        {Stats.length > 0 ? (
          <RequestTypesGraph data={Stats} />
        ) : (
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

export default RequestTypeStats;

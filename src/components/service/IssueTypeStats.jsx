import React, { useEffect, useState } from "react";
import { Select } from "antd";
import toast from "react-hot-toast";
import { GetIssueTypeStats } from "../../service/quality-analytics.service";
import RequestTypesGraph from "../graphs/RequestTypesGraph";
import IssueTypeTable from "../tables/IssueTypeTable";
import { useAuth } from "../../hooks/AuthProvider";
import Loader from "../Loader";

const IssueTypeStats = () => {
  const [Stats, setStats] = useState([]);
  const [timeSpan, setTimeSpan] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const { userLocation } = useAuth();
  const FetchIssueTypeStats = async () => {
    setIsLoading(true);
    try {
      const stats = await GetIssueTypeStats(timeSpan, "", userLocation);
      setStats(stats);
    } catch (err) {
      toast.error("Unknown error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    FetchIssueTypeStats();
  }, [timeSpan, userLocation]);
  return (
    <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg overflow-auto">
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <span className="flex items-center gap-3 text-lg sm:text-xl font-semibold">
          Most Common Issues Reported
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
      <section className="max-h-[440px]">
        {Stats.length > 0 ? (
          <IssueTypeTable data={Stats} />
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

export default IssueTypeStats;

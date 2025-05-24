import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import IssueTypeTable from "../../components/tables/IssueTypeTable";
import toast from "react-hot-toast";
import { GetIssueTypeStats } from "../../service/quality-analytics.service";
import { Select } from "antd";
import { GetTechnicianHistory } from "../../service/technician.service";
import { useAuth } from "../../hooks/AuthProvider";
import Loader from "../../components/Loader";

const TechnicianHistory = () => {
  const [searchParams] = useSearchParams();
  const [TechnicianName, setTechnicianName] = useState(
    searchParams.get("technician")
  );
  const { location, userLocation } = useAuth();
  const [issueStats, setIssueStats] = useState(null);
  const [serviceStats, setServiceStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeSpan, setTimeSpan] = useState("monthly");

  const FetchIssueTypeStats = async () => {
    try {
      const stats = await GetIssueTypeStats(
        timeSpan,
        TechnicianName,
        userLocation
      );
      setIssueStats(stats);
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };

  const FetchServieStats = async () => {
    try {
      const data = await GetTechnicianHistory(TechnicianName, location);
      setServiceStats(data.serviceStats);
    } catch {
      toast.error("Unknown Error Occured");
    }
  };

  useEffect(() => {
    FetchIssueTypeStats();
    FetchServieStats();
  }, [timeSpan]);

  const urlparam = new URLSearchParams({ technician: TechnicianName });

  return (
    <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <span className="flex items-center gap-3 text-2xl font-semibold">
          {`${TechnicianName}'s Service History`}
        </span>
        <div className="flex items-center px-2 py-0 rounded-lg w-max">
          <Link
            to={{
              pathname: "/technician-records/history",
              search: `${urlparam}`,
            }}
            className="border border-[#FF5733] bg-[#FF5733] text-white px-4 py-2 rounded-md"
          >
            Show Complete Details
          </Link>
        </div>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="flex flex-col gap-4">
          <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
            <span className="flex items-center gap-3 text-lg font-semibold">
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
          <div className="border p-2 rounded-lg">
            {issueStats?.length > 0 ? (
              <IssueTypeTable data={issueStats} />
            ) : (
              <Loader
                isLoading={isLoading}
                Title={"No Data Found"}
                height={200}
                width={200}
              />
            )}
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
            <span className="flex items-center gap-3 text-lg font-semibold">
              Service Data Progress View
            </span>
          </header>
          {serviceStats ? (
            <section className="border rounded-lg p-4 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-medium">To-Do</p>
                <span className="text-sm font-medium">
                  Number of Tasks that need to be completed and are not yet
                  started
                </span>
                <p className="text-red-500 text-3xl py-2">
                  {serviceStats["To Do"]}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-medium">In-Progress</p>
                <span className="text-sm font-medium">
                  Number of Tasks that are in progress currently
                </span>
                <p className="text-yellow-400 text-3xl py-2">
                  {serviceStats["In Progress"]}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-medium">Done</p>
                <span className="text-sm font-medium">
                  Number of Tasks completed
                </span>
                <p className="text-green-500 text-3xl py-2">
                  {serviceStats["Done"]}
                </p>
              </div>
            </section>
          ) : (
            <Loader isLoading={true} />
          )}
        </section>
      </section>
    </section>
  );
};

export default TechnicianHistory;

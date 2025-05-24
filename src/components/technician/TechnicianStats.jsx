import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GetTechnicianRecords } from "../../service/technician.service";
import BookedVsDonePie from "../graphs/BookedVsDonePie";
import Loader from "../Loader";
const TechnicianStats = () => {
  const [TechnicianStats, setTechnicianStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const FetchTechnicianRecords = async () => {
    setIsLoading(true);
    try {
      const data = await GetTechnicianRecords();
      setTechnicianStats(data[0]);
    } catch {
      toast.error("Unknown Error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    FetchTechnicianRecords();
  }, []);
  return (
    <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <span className="flex items-center gap-3 text-2xl font-semibold">
          Technician Records
        </span>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <section>
          <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
            <span className="flex items-center gap-3 text-lg font-medium">
              Weekly Service Requests
            </span>
          </header>
          <main>
            {TechnicianStats && (
              <BookedVsDonePie
                data={[
                  TechnicianStats.weeklyBooked,
                  TechnicianStats.weeklyDone,
                ]}
              />
            )}
            {isLoading && <Loader isLoading={true} />}
          </main>
        </section>
        <section>
          <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
            <span className="flex items-center gap-3 text-lg font-medium">
              Monthly Service Requests
            </span>
          </header>
          <main>
            {TechnicianStats && (
              <BookedVsDonePie
                data={[
                  TechnicianStats.monthlyBooked,
                  TechnicianStats.monthlyDone,
                ]}
              />
            )}
            {isLoading && <Loader isLoading={true} />}
          </main>
        </section>
      </main>
    </section>
  );
};

export default TechnicianStats;

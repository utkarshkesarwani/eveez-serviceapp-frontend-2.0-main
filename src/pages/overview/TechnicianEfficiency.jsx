import React from "react";
import WeeklyAnalysis from "../../components/overview/WeeklyAnalysis";
import AvgTimeTaken from "../../components/overview/AvgTimeTaken";
import OnTimevsDelayed from "../../components/overview/OnTimevsDelayed";

const TechnicianEfficiency = () => {
  return (
    <section className="m-4 flex flex-col gap-5">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-white p-3 rounded-md">
          <AvgTimeTaken />
        </section>
        <section className="bg-white p-3 rounded-md">
          <OnTimevsDelayed />
        </section>
      </section>
      <section className="bg-white w-full rounded-md p-2">
        <WeeklyAnalysis />
      </section>
    </section>
  );
};

export default TechnicianEfficiency;

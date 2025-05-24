import React from "react";
import OnTimevsDelayed from "../../components/overview/OnTimevsDelayed";
import LeastPerforming from "../../components/overview/LeastPerforming";
import ServiceRequestSummary from "../../components/overview/ServiceRequestSummary";
import TicketStats from "../../components/overview/TicketStats";

const Overview = () => {
  return (
    <section className="m-4 flex flex-col gap-5">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-white p-3 rounded-md">
          <ServiceRequestSummary />
        </section>
        <TicketStats />
      </section>
      <LeastPerforming />
    </section>
  );
};

export default Overview;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  GetInProgressTickets,
  GetNotAssignedRequests,
  GetNotDoneRequests,
} from "../../service/servicerequest.service";
import { useAuth } from "../../hooks/AuthProvider";

const TicketStats = () => {
  const [ticketStats, setTicketStats] = useState({
    unassigned: "NA",
    in_progress: "NA",
    not_done: "NA",
  });
  const { userLocation } = useAuth();
  const FetchUnassignedTickets = async () => {
    try {
      const data = await GetNotAssignedRequests(userLocation);
      setTicketStats((prev) => ({ ...prev, unassigned: data.length }));
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };
  const FetchInProgressTickets = async () => {
    try {
      const data = await GetInProgressTickets(userLocation);
      setTicketStats((prev) => ({ ...prev, in_progress: data.length }));
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };
  const FetchNotDoneTickets = async () => {
    try {
      const data = await GetNotDoneRequests(userLocation);
      setTicketStats((prev) => ({ ...prev, not_done: data.length }));
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };
  useEffect(() => {
    FetchInProgressTickets();
    FetchNotDoneTickets();
    FetchUnassignedTickets();
  }, [userLocation]);
  return (
    <section className="grid grid-rows-3 gap-6 text-base sm:text-lg md:text-xl">
      <div className="bg-white p-2 text-center flex flex-col gap-4 rounded-lg">
        <span className="font-normal">Open Tickets For More Than 5 Days</span>
        <p className="font-semibold">{ticketStats.not_done}</p>
      </div>
      <div className="bg-white p-2 text-center flex flex-col gap-4 rounded-lg">
        <span className="font-normal">
          Tickets In Progress For More Than 5 Days
        </span>
        <p className="font-semibold">{ticketStats.in_progress}</p>
      </div>
      <div className="bg-white p-2 text-center flex flex-col gap-4 rounded-lg">
        <span className="font-normal">Unassigned Tickets</span>
        <p className="font-semibold">{ticketStats.unassigned}</p>
      </div>
    </section>
  );
};

export default TicketStats;

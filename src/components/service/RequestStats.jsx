import React, { useState, useEffect } from "react";
import { GetServiceRequestStats } from "../../service/servicerequest.service";
import { SquareArrowUp } from "lucide-react";
import { useAuth } from "../../hooks/AuthProvider";

const RequestStats = () => {
  const [RequestStats, setRequestStats] = useState({
    "To Do": 0,
    "In progress": 0,
    Done: 0,
    totalTickets: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { userLocation } = useAuth();
  // Fetch Service Request Stats
  const FetchRequestStats = async () => {
    setIsLoading(true);
    try {
      const stats = await GetServiceRequestStats(userLocation);
      const formatted = {};
      stats.forEach((stat) => {
        formatted[stat.name] = stat.count;
      });
      setRequestStats(formatted);
    } catch (err) {
      toast.error("Unknown error Occured");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchRequestStats();
  }, [userLocation]);

  // Stat Cards
  const Cards = [
    {
      tag: "totalTickets",
      description: "Total Tickets",
      icon: (
        <img src={"/total_assets.png"} className="h-5 w-5" alt="Assets image" />
      ),
      backroundColor: "#FFE2E5",
      iconBackground: "#FA5A7D",
    },
    {
      tag: "In Progress",
      description: "In progress",
      icon: (
        <img
          src={"/total_kms.png"}
          className="h-5 w-5"
          alt="Kilometers image"
        />
      ),
      backroundColor: "#FFF4DE",
      iconBackground: "#FF947A",
    },
    {
      tag: "Done",
      description: "Completed",
      icon: (
        <img src={"/fuel_saved.png"} className="h-5 w-5" alt="Fuel image" />
      ),
      backroundColor: "#DCFCE7",
      iconBackground: "#3CD856",
    },
    {
      tag: "To Do",
      description: "To-Do Tickets",
      icon: (
        <img
          src={"/upcoming_payments.png"}
          className="h-4 w-4"
          alt="Payments image"
        />
      ),
      backroundColor: "#F3E8FF",
      iconBackground: "#BF83FF",
    },
  ];

  return (
    <section className=" bg-white rounded-xl flex flex-col gap-3">
      <header>
        <h1 className="text-xl  md:text-2xl  font-[600]">Service Requests</h1>
        <span className="text-xs">Summary</span>
      </header>
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-10 font-semibold">
        {Cards.map((card) => {
          return (
            <section
              key={card.tag}
              className={`text-center p-4 py-5 rounded-lg flex  gap-3`}
              style={{ backgroundColor: card.backroundColor }}
            >
              <div
                className={`w-max h-max rounded-full p-2`}
                style={{ backgroundColor: card.iconBackground }}
              >
                {card.icon}
              </div>
              <div className="text-left">
                <span className="font-semibold text-base lg:text-lg">
                  {RequestStats[card.tag] || 0}
                </span>
                <p className="text-gray-700 text-sm">{card.description}</p>
              </div>
            </section>
          );
        })}
      </main>
    </section>
  );
};

export default RequestStats;

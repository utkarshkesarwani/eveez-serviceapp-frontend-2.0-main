import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/Loader";
import { defaultDateFormat } from "../../utils/TimeFormatter";
import {
  AssignTicketToTechncian,
  GetTicketData,
} from "../../service/assign.service";
import TechnicianSelect from "../../components/TechnicianSelect";

const AssignTicket = () => {
  const { TicketId } = useParams();
  const [TicketData, setTicketData] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [newTechnician, setNewTechnician] = useState(null);
  const navigate = useNavigate();
  // Fetch Ticket Data
  const FetchTicketData = async () => {
    setIsLoading(true);
    try {
      const Data = await GetTicketData(TicketId);
      setTicketData(Data);
    } catch (err) {
      toast.error("Unknown error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  const HandleTechncianAssign = async () => {
    try {
      const res = AssignTicketToTechncian(TicketId, newTechnician);
      toast.success("Technician Assigned");
      setTimeout(() => {
        navigate("/assign");
      }, 1000);
    } catch (err) {
      toast.error("Assign Failed");
    }
  };

  useEffect(() => {
    FetchTicketData();
  }, []);
  
  return (
    <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <h1 className="text-lg  md:text-xl  font-[600]">
          Assign Technician &nbsp;&gt;&nbsp;&nbsp;{`#${TicketId}`}
        </h1>
      </header>
      {/* Technician Details */}
      <section className="p-2 py-4 border border-slate-300 rounded-lg grid grid-cols-1 sm:grid-cols-2 items-center gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Assign To
          </label>
          <TechnicianSelect
            withWorkLoad={true}
            width={400}
            size="large"
            onChange={(id) => setNewTechnician(id)}
          />
        </div>
        <div className="h-full flex justify-center items-center">
          <button
            onClick={HandleTechncianAssign}
            className="border border-orange-400 text-white bg-orange-400 p-1.5 px-3 rounded-md"
          >
            Assign Technician
          </button>
        </div>
      </section>
      {/* Customer Details */}
      {TicketData && (
        <section className="p-2 py-4 border border-slate-300 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Customer Name
            </label>
            <input
              type="text"
              value={TicketData.customer_name}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Date
            </label>
            <input
              type="text"
              value={defaultDateFormat(TicketData.date)}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Vehicle Number
            </label>
            <input
              type="text"
              value={TicketData.vehicle}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Location
            </label>
            <input
              type="text"
              value={TicketData.location}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Mobile Number
            </label>
            <input
              type="text"
              value={TicketData.customer_mobile}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Email ID
            </label>
            <input
              type="text"
              value={TicketData.customer_email}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Status
            </label>
            <input
              type="text"
              value={TicketData.latestStatus}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Issue Type
            </label>
            <input
              type="text"
              value={TicketData.issue_type.join(", ") || "NA"}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Odometer Reading
            </label>
            <input
              type="text"
              value={TicketData.odometer_reading}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Request Type
            </label>
            <input
              type="text"
              value={TicketData.request_type}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Issue Description
            </label>
            <textarea
              rows={8}
              value={TicketData.issue_description}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Images
            </label>
            {TicketData.issue_photo.length > 0 ? (
              TicketData.issue_photo.map((image) => (
                <img src={image} alt="Issue Image" />
              ))
            ) : (
              <span>No images Found</span>
            )}
          </div>
        </section>
      )}
      {!TicketData && (
        <Loader
          Title="No Data Found"
          isLoading={IsLoading}
          height={300}
          width={300}
        />
      )}
    </section>
  );
};

export default AssignTicket;

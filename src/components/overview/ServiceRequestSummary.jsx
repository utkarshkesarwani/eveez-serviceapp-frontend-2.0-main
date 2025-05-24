import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ServiceRequestOverviewGraph from "../graphs/ServiceRequestOverviewGraph";
import TechnicianSelect from "../TechnicianSelect";
import { DatePicker } from "antd";
import { useAuth } from "../../hooks/AuthProvider";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { GetServiceRequestSummary } from "../../service/servicerequest.service";
import Loader from "../Loader";
import { ModalTheme } from "../../utils/themes";

const ServiceRequestSummary = () => {
  const { userRole, userLocation } = useAuth();
  const DUMMY = {
    done: 0,
    to_do: 0,
    in_progress: 0,
    total: 0,
  };
  const [openModal, setOpenModal] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [graphData, setGraphData] = useState(DUMMY);
  const [Technician, setTechnician] = useState(null);
  const [timeRange, setTimeRange] = useState("today");
  const [customTimeRange, setCustomRange] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { RangePicker } = DatePicker;
  const timeRanges = ["today", "weekly", "monthly", "custom"];

  const [dataFilters, setDataFilters] = useState({
    location: userLocation,
    startDate: "",
    endDate: "",
    technician: "",
  });

  // useEffect to handle both state updates and API call
  useEffect(() => {
    const fetchServiceRequestSummary = async () => {
      setIsLoading(true);
      try {
        let startDate = "";
        let endDate = "";
        if (timeRange === "weekly") {
          startDate = dayjs().subtract(1, "week").format("YYYY-MM-DD");
        } else if (timeRange === "monthly") {
          startDate = dayjs().startOf("month").format("YYYY-MM-DD");
          endDate = dayjs().endOf("month").format("YYYY-MM-DD");
        } else if (timeRange === "custom" && customTimeRange) {
          startDate = dayjs(customTimeRange[0]).format("YYYY-MM-DD");
          endDate = dayjs(customTimeRange[1]).format("YYYY-MM-DD");
        }

        const filters = {
          location: userLocation,
          startDate,
          endDate,
          technician: Technician || "",
        };

        const res = await GetServiceRequestSummary(filters);

        if (res.code == "1") {
          setResponseData(res.data[userLocation]);
        } else {
          throw new Error("Unknown Error");
        }
      } catch (err) {
        toast.error("Unknown Error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceRequestSummary();
  }, [timeRange, customTimeRange, Technician, userLocation]);

  return (
    <section>
      <header className="flex flex-row gap-3 md:items-center justify-between">
        <h1 className="text-lg md:text-xl font-[500] w-max">
          Service Requests
        </h1>
        <div className="flex items-center px-2 py-0 rounded-lg w-max">
          <button
            onClick={() => setOpenModal(true)}
            className="px-3 py-0.5 border border-slate-400 text-black font-semibold rounded-md mr-3"
          >
            Filters
          </button>
        </div>
        <Modal
          show={openModal}
          theme={ModalTheme}
          onClose={() => setOpenModal(false)}
        >
          <Modal.Header className="py-3">Choose Filters to Apply</Modal.Header>
          <Modal.Body>
            <section className="flex flex-col gap-3">
              <div className="grid grid-cols-4">
                <label htmlFor="Date" className="col-span-1">
                  Time Range
                </label>
                <div className="flex flex-col gap-3 col-span-3">
                  <div className="flex gap-3 justify-around">
                    {timeRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-0.5 rounded-lg border border-[#00000033] ${
                          timeRange === range
                            ? "bg-black text-white"
                            : "bg-[#0000000D] text-[#000000]"
                        }`}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="col-span-3 px-2">
                    {timeRange === "custom" && (
                      <RangePicker
                        onChange={(value) => setCustomRange(value)}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4">
                <label htmlFor="Date" className="col-span-1">
                  Technician
                </label>
                <div className="w-full px-2">
                  <TechnicianSelect
                    withWorkLoad={false}
                    onChange={(value) => setTechnician(value)}
                    width={250}
                    additionalOptions={[{ label: "All", value: "" }]}
                    defaultValue={""}
                    location={userLocation}
                  />
                </div>
              </div>
            </section>
          </Modal.Body>
          <Modal.Footer className="flex justify-center py-3">
            <button
              onClick={() => setOpenModal(false)}
              className="px-3 py-1 border border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md mr-3"
            >
              Done
            </button>
          </Modal.Footer>
        </Modal>
      </header>
      <main>
        {responseData && responseData.total != 0 ? (
          <ServiceRequestOverviewGraph data={responseData} />
        ) : (
          <Loader isLoading={isLoading} width={300} height={300} />
        )}
      </main>
    </section>
  );
};

export default ServiceRequestSummary;
